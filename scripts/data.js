const counts = {
  weapons: 30,
  materials: 30,
  trophies: 37
};
const words = {
  weapons: "клинков",
  materials: "материалов",
  trophies: "достижений"
};
const icons = {
  forge_heart: "images/icons/forge_heart.png",
  seraph_feather: "images/icons/seraph_feather.png",
  jungle_heart: "images/icons/jungle_heart.png",
  soul_shard: "images/icons/soul_shard.png",
  celestial_shard: "images/icons/celestial_shard.png",
  jungle_shard: "images/icons/jungle_shard.png",
  night_seal: "images/icons/night_seal.png",
  black_substance: "images/icons/black_substance.png",
  ancient_part: "images/icons/ancient_part.png",
  harbinger_core: "images/icons/harbinger_core.png",
  terra_essence: "images/icons/terra_essence.png",
  royal_clock: "images/icons/royal_clock.png",
  terra_compass: "images/icons/terra_compass.png",
  terra_ingot: "images/icons/terra_ingot.png",
  demon_soul: "images/icons/demon_soul.png",
  ancient: "images/icons/ancient.png",
  hell_essence: "images/icons/hell_essence.png",
  wanderer_cube: "images/icons/wanderer_cube.png",
  wanderer_cube_green: "images/icons/wanderer_cube.png",
  wanderer_cube_blue: "images/icons/wanderer_cube_blue.png",
  wanderer_cube_orange: "images/icons/wanderer_cube_orange.png",
  wanderer_cube_purple: "images/icons/wanderer_cube_purple.png",
  wanderer_cube_red: "images/icons/wanderer_cube_red.png",
  wanderer_cube_gray: "images/icons/wanderer_cube_gray.png",
  molten_helmet: "images/icons/molten_helmet.png",
  paladin_helmet: "images/icons/paladin_helmet.png",
  night_king_helmet: "images/icons/night_king_helmet.png",
  terra_helmet: "images/icons/terra_helmet.png",
  demon_helmet: "images/icons/demon_helmet.png",
  lord_soul: "images/icons/lord_soul.png"
};
const guideIcons = {
  diamond: "images/guide/diamond.png",
  emerald: "images/guide/emerald.png",
  emerald_block: "images/guide/emerald_block.png",
  crying_obsidian: "images/guide/crying_obsidian.png",
  nether_star: "images/guide/nether_star.png",
  wind_charge: "images/guide/wind_charge.png",
  nether_brick: "images/guide/nether_brick.png",
  compass: "images/guide/compass.png",
  map: "images/guide/map.png",
  lapis_block: "images/guide/lapis_block.png",
  diamond_block: "images/guide/diamond_block.png",
  gold_block: "images/guide/gold_block.png",
  copper_block: "images/guide/copper_block.png",
  iron_block: "images/guide/iron_block.png",
  redstone_block: "images/guide/redstone_block.png",
  ender_pearl: "images/guide/ender_pearl.png",
  netherite_ingot: "images/guide/netherite_ingot.png",
  amethyst_shard: "images/guide/amethyst_shard.png",
  paper: "images/guide/paper.png",
  light_blue_dye: "images/guide/light_blue_dye.png",
  black_dye: "images/guide/black_dye.png",
  quartz: "images/guide/quartz.png",
  totem_of_undying: "images/guide/totem_of_undying.png",
  phantom_membrane: "images/guide/phantom_membrane.png",
  air_compass: "images/guide/compass.png",
  night_compass: "images/guide/compass.png",
  unknown_compass: "images/guide/compass.png",
  forge_map: "images/guide/forge_map.png",
  jungle_map: "images/guide/jungle_map.png",
  "minecraft:spyglass": "images/guide/minecraft:spyglass.png",
  "minecraft:wither_skeleton_skull": "images/guide/minecraft:wither_skeleton_skull.png",
  "minecraft:totem_of_undying": "images/guide/totem_of_undying.png",
  "minecraft:zombie_head": "images/guide/minecraft:zombie_head.png",
  "minecraft:sculk_shrieker": "images/guide/minecraft:sculk_shrieker.png",
  "minecraft:ender_eye": "images/guide/minecraft:ender_eye.png",
  "minecraft:iron_sword": "images/guide/minecraft:iron_sword.png",
  "minecraft:emerald": "images/guide/emerald.png",
  "minecraft:skeleton_skull": "images/guide/minecraft:skeleton_skull.png",
  "minecraft:crossbow": "images/guide/minecraft:crossbow.png",
  "minecraft:experience_bottle": "images/guide/minecraft:experience_bottle.png",
  "minecraft:nether_star": "images/guide/nether_star.png",
  "minecraft:red_dye": "images/guide/minecraft:red_dye.png"
};
const images = {
  forge: "images/places/forge.webp",
  temple: "images/places/temple.webp",
  jungle: "images/places/jungle.webp",
  factory: "images/places/factory.webp",
  night: "images/places/night.webp",
  castle: "images/places/castle.webp"
};
const rarities = [
  {
    "const": "COMMON",
    label: "Обычная",
    palette: [
      "#c9cfd6",
      "#9aa3ad"
    ],
    period: 0,
    motion: "неподвижная",
    used: [
      "Погибель",
      "Резак"
    ]
  },
  {
    "const": "UNCOMMON",
    label: "Необычная",
    palette: [
      "#7ae04a",
      "#3f9e2a"
    ],
    period: 0,
    motion: "неподвижная",
    used: [
      "Арахнид",
      "Сумрачная секира"
    ]
  },
  {
    "const": "EPIC",
    label: "Эпическая",
    palette: [
      "#c479ff",
      "#7a2fd0"
    ],
    period: 0,
    motion: "неподвижная",
    used: [
      "Демонический резак"
    ]
  },
  {
    "const": "HELLISH",
    label: "Адская",
    palette: [
      "#ff9a3c",
      "#c21e1e"
    ],
    period: 0,
    motion: "неподвижная",
    used: [
      "Бедствие",
      "Воля Демона",
      "Убийца демонов",
      "Сборщик душ",
      "Секира берсерка",
      "Душа демона",
      "Осколок души"
    ]
  },
  {
    "const": "SUPER_HELLISH",
    label: "Супер-адская",
    palette: [
      "#ffe66b",
      "#ff6a1e",
      "#8f1400",
      "#ff6a1e"
    ],
    period: 60,
    motion: "переливается, проход 3 с",
    used: [
      "Люцифер",
      "Душа Иссушителя",
      "Адская сущность",
      "Королевские часы",
      "Тайник пепла",
      "Душа лорда"
    ]
  },
  {
    "const": "ULTRA_HELLISH",
    label: "Ультра-адская",
    palette: [
      "#141414",
      "#5c5c5c",
      "#c4c4c4",
      "#5c5c5c"
    ],
    period: 20,
    motion: "переливается, проход 1 с",
    used: [
      "Все-Чёрный",
      "Империум",
      "Сердце кузни",
      "Чёрная субстанция",
      "Тессеракт"
    ]
  },
  {
    "const": "TERRA",
    label: "Терра",
    palette: [
      "#f0ffc0",
      "#8ee83a",
      "#0a4a12",
      "#8ee83a"
    ],
    period: 45,
    motion: "переливается, проход 2.25 с",
    used: [
      "Терра-резак",
      "Терра-блейд",
      "Древний",
      "Энигма",
      "Селестиал",
      "Терра-слиток",
      "Реликтовый осколок",
      "Сердце джунглей",
      "Терра-сущность",
      "Терра-компас",
      "Терра-магнит",
      "Джунглевая коробка"
    ]
  },
  {
    "const": "CELESTIAL",
    label: "Небесная",
    palette: [
      "#fff8e0",
      "#a8e2ff",
      "#ffd36b",
      "#a8e2ff"
    ],
    period: 40,
    motion: "золотой перелив, проход 2 с",
    used: [
      "Золотой феникс",
      "Солнцестояние",
      "Призрачный страж",
      "Экскалибур",
      "Hyperion",
      "Небесный осколок",
      "Перо серафима",
      "Ангельская шкатулка",
      "V — Иерофант",
      "VIII — Правосудие",
      "XVIII — Луна"
    ]
  },
  {
    "const": "CELESTIAL_NIGHT",
    label: "Небесная",
    palette: [
      "#0a1440",
      "#2f6bff",
      "#a9c8ff",
      "#2f6bff"
    ],
    period: 40,
    motion: "синий перелив, проход 2 с",
    used: [
      "Ночная фурия",
      "Звёздная грань",
      "Реквием девятого неба",
      "Истинный Экскалибур",
      "Печать ночи"
    ]
  },
  {
    "const": "BLOODY",
    label: "Кровавая",
    palette: [
      "#ff6b6b",
      "#c20000",
      "#3d0000",
      "#c20000"
    ],
    period: 35,
    motion: "переливается, проход 1.75 с",
    used: [
      "Сердце хранителя"
    ]
  },
  {
    "const": "TECHNO",
    label: "Техно",
    palette: [
      "#e6e9ec",
      "#8e959c",
      "#3a3f45",
      "#d61f1f"
    ],
    period: 30,
    motion: "переливается, проход 1.5 с",
    used: [
      "Энцефало-меч",
      "Энцефало-клинок",
      "Антихрист",
      "Древняя деталь",
      "Ядро Предвестника",
      "Призывной медный голем",
      "Призывной малый Предвестник",
      "Сборочный купол"
    ]
  }
];
const items = [
  {
    kind: "weapon",
    id: "doom",
    name: "Погибель",
    rarity: "COMMON",
    rarityLabel: "Обычная",
    line: "hell",
    lore: [
      '<span style="color:#555555"><em>Он ждал в темноте дольше, чем стоит город над ним.</em></span>',
      "",
      '<span style="color:#AAAAAA">Ни чар, ни хитростей. Только сталь,</span>',
      '<span style="color:#AAAAAA">которая пережила всех, кто её боялся.</span>'
    ],
    abilities: [],
    stats: "Урон 7 · Скорость 1.6",
    damage: 7,
    speed: 1.6,
    icon: "images/other/72806b35de.png",
    obtain: "Сундуки древнего города",
    method: "loot",
    methodLabel: "Находка",
    recipe: false
  },
  {
    kind: "weapon",
    id: "calamity",
    name: "Бедствие",
    rarity: "HELLISH",
    rarityLabel: "Адская",
    line: "hell",
    lore: [
      '<span style="color:#555555"><em>В сталь вплавили то, что моргало. Теперь моргает сталь.</em></span>'
    ],
    abilities: [
      {
        name: "Пекло",
        colour: "#FFAA00",
        trigger: "ПКМ",
        kind: "rmb",
        rest: "5 мин с конца действия",
        text: "<span>На минуту — скорость, сила и огнестойкость.</span> <span>Из вас хлещет пламя, и это видно всем.</span>"
      }
    ],
    stats: "Урон 9 · Скорость 1.6",
    damage: 9,
    speed: 1.6,
    icon: "images/other/a4a3c2e4f9.png",
    obtain: "Эволюция Погибели в Незеритовой кузне",
    method: "evolve",
    methodLabel: "Эволюция у алтаря",
    recipe: false
  },
  {
    kind: "weapon",
    id: "demon_will",
    name: "Воля Демона",
    rarity: "HELLISH",
    rarityLabel: "Адская",
    line: "hell",
    lore: [
      '<span style="color:#555555"><em>Иссушитель умер. То, что внутри клинка, — нет.</em></span>'
    ],
    abilities: [
      {
        name: "Пекло",
        colour: "#FFAA00",
        trigger: "ПКМ",
        kind: "rmb",
        rest: null,
        text: "<span>Минута скорости, силы и огнестойкости —</span> <span>и всё живое в 35 блоках вспыхивает на 10 секунд.</span>"
      },
      {
        name: "Прозрение",
        colour: "#FF5555",
        trigger: null,
        kind: null,
        rest: null,
        text: "<span>Удар по подсвеченному проходит сквозь треть его брони.</span> <span>Убийство подсвеченного даёт регенерацию II на 5 секунд.</span>"
      }
    ],
    stats: "Урон 11 · Скорость 1.6",
    damage: 11,
    speed: 1.6,
    icon: "images/other/5ffe2fbc10.png",
    obtain: "Эволюция Бедствия в Незеритовой кузне",
    method: "evolve",
    methodLabel: "Эволюция у алтаря",
    recipe: false
  },
  {
    kind: "weapon",
    id: "all_black",
    name: "Все-Чёрный",
    rarity: "ULTRA_HELLISH",
    rarityLabel: "Ультра-адская",
    line: "abyss",
    lore: [
      '<span style="color:#555555"><em>Из его тьмы на вас кто-то смотрит.</em></span>',
      '<span style="color:#555555"><em>Дотянуться он может. Просто не хочет.</em></span>',
      "",
      '<span style="color:#AAAAAA"><em>Чтобы презирать богов, надо их знать.</em></span>'
    ],
    abilities: [
      {
        name: "Ужас",
        colour: "#FF5A5A",
        trigger: null,
        kind: null,
        rest: null,
        text: "<span>Мирные и стрелки идут к вам вплотную,</span> <span>бойцы ближнего боя отлетают в чёрном дыму.</span>"
      },
      {
        name: "Жертва",
        colour: "#FF5A5A",
        trigger: null,
        kind: null,
        rest: null,
        text: "<span>Первый, кого вы ударите, становится жертвой.</span> <span>От её руки вы не умрёте — ни от удара, ни от стрелы,</span> <span>ни от падения, в которое она вас сбросила.</span> <span>Жертва одна; её отпускает смерть или полминуты</span> <span>без ваших ударов.</span>"
      },
      {
        name: "Тёмная территория",
        colour: "#FF5A5A",
        trigger: "ПКМ",
        kind: "rmb",
        rest: "5 мин",
        text: "<span>Тёмный купол на 30 секунд. Чёрные разрезы в нём</span> <span>ранят всех, кроме своих.</span> <span>Пока вы внутри, вас нельзя убить.</span>"
      }
    ],
    stats: "Урон 14 · Скорость 1.6",
    damage: 14,
    speed: 1.6,
    icon: "images/other/63ca5f7c3f.png",
    obtain: "Эволюция короны крови с Чёрной субстанцией у алтаря своего храма",
    method: "evolve",
    methodLabel: "Эволюция у алтаря",
    recipe: false
  },
  {
    kind: "weapon",
    id: "imperium",
    name: "Империум",
    rarity: "ULTRA_HELLISH",
    rarityLabel: "Ультра-адская",
    line: "hell",
    lore: [
      '<span style="color:#555555"><em>Клинок пекла, выкованный из его же сердца.</em></span>'
    ],
    abilities: [
      {
        name: "Огненный эдикт",
        colour: "#FFAA00",
        trigger: "ПКМ",
        kind: "rmb",
        rest: "5 мин",
        text: "<span>Огненное поле на 15 секунд: враги в нём горят,</span> <span>даже неуязвимые к огню.</span>"
      },
      {
        name: "Дыхание пекла",
        colour: "#FFAA00",
        trigger: "Зажать ПКМ",
        kind: "hold",
        rest: null,
        text: "<span>Огонь вперёд, как дыхание дракона: ранит и поджигает</span> <span>врагов. Без перезарядки.</span>"
      },
      {
        name: "Душа пекла",
        colour: "#55FFFF",
        trigger: "Под «Пламенем за спиной»",
        kind: "other",
        rest: null,
        text: "<span>Пока пепельная кровь пробуждена, Империум горит</span> <span>огнём душ: сильнее, дальше, эдикт замедляет —</span> <span>и берёт всех, кроме союзников, даже мирных мобов.</span>"
      },
      {
        name: "Дом",
        colour: "#FFAA00",
        trigger: "Пассивно",
        kind: "passive",
        rest: null,
        text: "<span>В Незере удары и способности — вдвое сильнее.</span>"
      }
    ],
    stats: "Урон 14 · Скорость 1.6",
    damage: 14,
    speed: 1.6,
    icon: "images/other/f29e190984.png",
    obtain: "Эволюция Воли Демона в Незеритовой кузне",
    method: "evolve",
    methodLabel: "Эволюция у алтаря",
    recipe: false
  },
  {
    kind: "weapon",
    id: "cutter",
    name: "Резак",
    rarity: "COMMON",
    rarityLabel: "Обычная",
    line: "cleaver",
    lore: [
      '<span style="color:#555555"><em>Кто-то унёс его под землю и не вернулся.</em></span>'
    ],
    abilities: [
      {
        name: "Разделка",
        colour: "#CFC9D6",
        trigger: null,
        kind: null,
        rest: null,
        text: "<span>Удар достаёт врагов в области 3×3×3 вокруг цели.</span>"
      }
    ],
    stats: "Урон 5 · Скорость 1",
    damage: 5,
    speed: 1,
    icon: "images/other/9adf817a26.png",
    obtain: "Сундуки древнего города",
    method: "loot",
    methodLabel: "Находка",
    recipe: false
  },
  {
    kind: "weapon",
    id: "demonic_cutter",
    name: "Демонический резак",
    rarity: "EPIC",
    rarityLabel: "Эпическая",
    line: "cleaver",
    lore: [
      '<span style="color:#555555"><em>Лезвие потемнело и стало брать шире.</em></span>'
    ],
    abilities: [
      {
        name: "Разделка",
        colour: "#FF55FF",
        trigger: null,
        kind: null,
        rest: null,
        text: "<span>Удар достаёт врагов в области 4×4×4 вокруг цели.</span>"
      }
    ],
    stats: "Урон 7 · Скорость 1",
    damage: 7,
    speed: 1,
    icon: "images/other/9499d8c8aa.png",
    obtain: "Крафт: Резак + Душа демона",
    method: "craft",
    methodLabel: "Верстак",
    recipe: true
  },
  {
    kind: "weapon",
    id: "terra_cutter",
    name: "Терра-резак",
    rarity: "TERRA",
    rarityLabel: "Терра",
    line: "cleaver",
    lore: [
      '<span style="color:#555555"><em>Зелёный металл не тупится и не прощает.</em></span>'
    ],
    abilities: [
      {
        name: "Разделка",
        colour: "#55FF55",
        trigger: null,
        kind: null,
        rest: null,
        text: "<span>Удар достаёт врагов в области 5×5×5 вокруг цели.</span>"
      },
      {
        name: "Жила",
        colour: "#55FF55",
        trigger: null,
        kind: null,
        rest: null,
        text: "<span>С каждого убитого падает изумруд. Шанс — треть.</span>"
      }
    ],
    stats: "Урон 10 · Скорость 1",
    damage: 10,
    speed: 1,
    icon: "images/other/2808503131.png",
    obtain: "Крафт из Демонического резака и терра-слитков",
    method: "craft",
    methodLabel: "Верстак",
    recipe: true
  },
  {
    kind: "weapon",
    id: "arachnid",
    name: "Арахнид",
    rarity: "UNCOMMON",
    rarityLabel: "Необычная",
    line: "blood",
    lore: [
      '<span style="color:#555555"><em>Тот, кто его ковал, держал пауков не для яда.</em></span>'
    ],
    abilities: [
      {
        name: "Свой среди чужих",
        colour: "#C86BFF",
        trigger: null,
        kind: null,
        rest: null,
        text: "<span>По паукам бьёт вдвое сильнее.</span>"
      },
      {
        name: "Свора",
        colour: "#FF55FF",
        trigger: null,
        kind: null,
        rest: null,
        text: "<span>Удар зовёт паука на ту же цель. Он ваш и вас не тронет,</span> <span>но уходит, простояв без дела полминуты.</span>"
      }
    ],
    stats: "Урон 8 · Скорость 1.6",
    damage: 8,
    speed: 1.6,
    icon: "images/other/8572c066ae.png",
    obtain: "Сундуки заброшенной шахты",
    method: "loot",
    methodLabel: "Находка",
    recipe: false
  },
  {
    kind: "weapon",
    id: "demon_slayer",
    name: "Убийца демонов",
    rarity: "HELLISH",
    rarityLabel: "Адская",
    line: "blood",
    lore: [
      '<span style="color:#555555"><em>Паучья сталь напилась и больше не отпускает.</em></span>'
    ],
    abilities: [
      {
        name: "Жажда",
        colour: "#FF5555",
        trigger: null,
        kind: null,
        rest: null,
        text: "<span>Удар с шансом в треть возвращает вам половину</span> <span>того, что вы нанесли.</span>"
      },
      {
        name: "Добыча",
        colour: "#FF5555",
        trigger: null,
        kind: null,
        rest: null,
        text: "<span>Убийство возвращает пятую часть здоровья цели —</span> <span>чем крупнее добыча, тем больше достаётся вам.</span>"
      }
    ],
    stats: "Урон 10 · Скорость 1.6",
    damage: 10,
    speed: 1.6,
    icon: "images/other/8f2915c708.png",
    obtain: "Крафт: Арахнид + Душа демона",
    method: "craft",
    methodLabel: "Верстак",
    recipe: true
  },
  {
    kind: "weapon",
    id: "grave_splitter",
    name: "Сборщик душ",
    rarity: "HELLISH",
    rarityLabel: "Адская",
    line: "blood",
    lore: [
      '<span style="color:#555555"><em>Он помнит лицо Проклятого короля —</em></span>',
      '<span style="color:#555555"><em>настоящее, не пиглинье. Каждая трещина</em></span>',
      '<span style="color:#555555"><em>на этом оружии — след разорванного контракта,</em></span>',
      '<span style="color:#555555"><em>а его холодный блеск — напоминание о том,</em></span>',
      '<span style="color:#555555"><em>что любая корона рано или поздно превращается</em></span>',
      '<span style="color:#555555"><em>в прах под копытами свиней.</em></span>'
    ],
    abilities: [
      {
        name: "Жажда",
        colour: "#FF5555",
        trigger: null,
        kind: null,
        rest: null,
        text: "<span>Удар с шансом в треть возвращает вам половину</span> <span>того, что вы нанесли.</span>"
      },
      {
        name: "Добыча",
        colour: "#FF5555",
        trigger: null,
        kind: null,
        rest: null,
        text: "<span>Убийство возвращает пятую часть здоровья цели.</span>"
      },
      {
        name: "Свита могил",
        colour: "#FF5555",
        trigger: "ПКМ",
        kind: "rmb",
        rest: "60 с",
        text: "<span>Три скелета-иссушителя встают и бьются за вас.</span> Стоят 30 секунд."
      }
    ],
    stats: "Урон 11 · Скорость 1.6",
    damage: 11,
    speed: 1.6,
    icon: "images/other/ca0b2d0595.png",
    obtain: "Эволюция Убийцы демонов в Незеритовой кузне",
    method: "evolve",
    methodLabel: "Эволюция у алтаря",
    recipe: false
  },
  {
    kind: "weapon",
    id: "lucifer",
    name: "Люцифер",
    rarity: "SUPER_HELLISH",
    rarityLabel: "Супер-адская",
    line: "blood",
    lore: [
      '<span style="color:#555555"><em>Выкованный из осколков утренней звезды,</em></span>',
      '<span style="color:#555555"><em>этот клинок хранит в себе первородный свет,</em></span>',
      '<span style="color:#555555"><em>ставший всепожирающим пламенем.</em></span>'
    ],
    abilities: [
      {
        name: "Дары незера",
        colour: "#FF5555",
        trigger: null,
        kind: null,
        rest: null,
        text: "<span>Каждого, кого вы ударили, с вами связывает</span> <span>красный луч — до 10 целей, до 20 блоков.</span> <span>Связанные теряют 2 здоровья в секунду,</span> <span>и всё отнятое лучами лечит вас.</span> <span>Отойдут дальше — луч рвётся.</span>"
      },
      {
        name: "Сделка с дьяволом",
        colour: "#FFAA00",
        trigger: "ПКМ",
        kind: "rmb",
        rest: "90 с",
        text: "<span>Поднимает купол радиусом 30 блоков на 30 секунд.</span> <span>Свои под ним исцеляются, бьют сильнее и держат удар.</span> <span>Чужие под ним горят и не могут залечить ран,</span> <span>а всё, что отнял у них огонь, лечит вас.</span>"
      }
    ],
    stats: "Урон 14 · Скорость 1.6",
    damage: 14,
    speed: 1.6,
    icon: "images/other/1f90250f5b.png",
    obtain: "???",
    method: "secret",
    methodLabel: "Секрет",
    recipe: false
  },
  {
    kind: "weapon",
    id: "gloomsteel_axe",
    name: "Сумрачная секира",
    rarity: "UNCOMMON",
    rarityLabel: "Необычная",
    line: "axe",
    lore: [
      '<span style="color:#555555"><em>Её ковали там, где не бывает рассвета.</em></span>',
      '<span style="color:#555555"><em>Она и не ждёт его.</em></span>'
    ],
    abilities: [
      {
        name: "Тяжесть",
        colour: "#CFC9D6",
        trigger: "Пассивно",
        kind: "passive",
        rest: null,
        text: "<span>Критический удар в прыжке замедляет цель</span> <span>на 2 секунды.</span>"
      },
      {
        name: "Иной облик",
        colour: "#C86BFF",
        trigger: null,
        kind: null,
        rest: null,
        text: "<span>Будь при вас, когда падёт страж святилища:</span> <span>Горнило — и она станет Секирой берсерка,</span> <span>Серафим — и она станет Золотым фениксом.</span>"
      }
    ],
    stats: "Урон 10 · Скорость 1",
    damage: 10,
    speed: 1,
    icon: "images/other/5e7c8e6aba.png",
    obtain: "Сундуки крепости Незера",
    method: "loot",
    methodLabel: "Находка",
    recipe: false
  },
  {
    kind: "weapon",
    id: "berserker_axe",
    name: "Секира берсерка",
    rarity: "HELLISH",
    rarityLabel: "Адская",
    line: "axe",
    lore: [
      '<span style="color:#555555"><em>Она видела, как остыл горн. Жар Горнила ушёл в неё —</em></span>',
      '<span style="color:#555555"><em>и каждая рана делает её тяжелее.</em></span>'
    ],
    abilities: [
      {
        name: "Ярость",
        colour: "#FF5555",
        trigger: "Пассивно",
        kind: "passive",
        rest: null,
        text: "<span>+5% урона за каждое потерянное сердце, до +50%.</span>"
      },
      {
        name: "Боевой клич",
        colour: "#FF5555",
        trigger: "ПКМ",
        kind: "rmb",
        rest: "60 с",
        text: "<span>10 секунд силы II, скорости и стойкости</span> <span>к отбрасыванию. Пока клич звучит, раны не заживают.</span> <span>Волна рёва отбрасывает врагов в 5 блоках и замедляет.</span>"
      }
    ],
    stats: "Урон 13 · Скорость 1",
    damage: 13,
    speed: 1,
    icon: "images/other/66344d5ef9.png",
    obtain: "Сумрачная секира меняется сама в испытании Незеритовой кузни",
    method: "grows",
    methodLabel: "Растёт сам",
    recipe: false
  },
  {
    kind: "weapon",
    id: "phoenix_axe",
    name: "Золотой феникс",
    rarity: "CELESTIAL",
    rarityLabel: "Небесная",
    line: "axe",
    lore: [
      '<span style="color:#555555"><em>Серафим упал, и его свет искал, где остаться.</em></span>',
      '<span style="color:#555555"><em>Сумрачная сталь впервые увидела рассвет.</em></span>'
    ],
    abilities: [
      {
        name: "Из пепла",
        colour: "#FFAA00",
        trigger: "Пассивно",
        kind: "passive",
        rest: null,
        text: "<span>Раз в 10 минут смертельный удар не убивает:</span> <span>4 сердца, огнестойкость и пламя вокруг.</span>"
      },
      {
        name: "Крыло",
        colour: "#FFAA00",
        trigger: "ПКМ",
        kind: "rmb",
        rest: "15 с",
        text: "<span>Огненная дуга на 8 блоков перед собой —</span> <span>союзников не задевает.</span>"
      }
    ],
    stats: "Урон 14 · Скорость 1",
    damage: 14,
    speed: 1,
    icon: "images/other/c02c9c9337.png",
    obtain: "Сумрачная секира меняется сама в испытании Небесного храма",
    method: "grows",
    methodLabel: "Растёт сам",
    recipe: false
  },
  {
    kind: "weapon",
    id: "solstice",
    name: "Солнцестояние",
    rarity: "CELESTIAL",
    rarityLabel: "Небесная",
    line: "sky",
    lore: [
      '<span style="color:#555555"><em>Самый длинный день в году.</em></span>',
      '<span style="color:#555555"><em>Для кого-то — последний.</em></span>'
    ],
    abilities: [
      {
        name: "Зенит",
        colour: "#FFFF55",
        trigger: "Пассивно",
        kind: "passive",
        rest: null,
        text: "<span>Днём +2 урона.</span>"
      },
      {
        name: "Полдень",
        colour: "#FFFF55",
        trigger: "Зажать ПКМ",
        kind: "hold",
        rest: null,
        text: '<span>Пока кнопка зажата, клинок вспыхивает каждую</span> <span>секунду: 2 урона всему враждебному в 12 блоках,</span> <span>нежить загорается.</span> <br><span style="color:#555555">Без перезарядки.</span>'
      }
    ],
    stats: "Урон 13 · Скорость 1.6",
    damage: 13,
    speed: 1.6,
    icon: "images/other/1a4474ed65.png",
    obtain: "Сокровищница бастиона, редко",
    method: "loot",
    methodLabel: "Находка",
    recipe: false
  },
  {
    kind: "weapon",
    id: "nocturne",
    name: "Ночная фурия",
    rarity: "CELESTIAL_NIGHT",
    rarityLabel: "Небесная",
    line: "night",
    lore: [
      '<span style="color:#555555"><em>Музыка, которую играют только для тех, кто не спит.</em></span>',
      '<span style="color:#555555"><em>И не проснётся.</em></span>',
      "",
      "",
      "",
      '<span style="color:#555555">Солнцестояние в одной руке и Ночная фурия в другой</span>',
      '<span style="color:#555555">не знают ни дня, ни ночи.</span>'
    ],
    abilities: [
      {
        name: "Полночь",
        colour: "#7F8BFF",
        trigger: "Пассивно",
        kind: "passive",
        rest: null,
        text: "<span>Ночью +2 урона. В руке — ночное зрение.</span>"
      },
      {
        name: "Ночной разрез",
        colour: "#7F8BFF",
        trigger: "ПКМ",
        kind: "rmb",
        rest: "6 с",
        text: "<span>Синий серп летит на 10 блоков вперёд и</span> <span>пронзает врагов на пути: 10 урона каждому.</span>"
      }
    ],
    stats: "Урон 13 · Скорость 1.6",
    damage: 13,
    speed: 1.6,
    icon: "images/other/6d22f8cf26.png",
    obtain: "Ковка в Тёмном храме или эволюция Солнцестояния",
    method: "forge",
    methodLabel: "Ковка у алтаря",
    recipe: false
  },
  {
    kind: "weapon",
    id: "phantomguard",
    name: "Призрачный страж",
    rarity: "CELESTIAL",
    rarityLabel: "Небесная",
    line: "sky",
    lore: [
      '<span style="color:#555555"><em>Он стоит на посту так давно, что забыл,</em></span>',
      '<span style="color:#555555"><em>что именно охраняет. Тебя — пока что.</em></span>'
    ],
    abilities: [
      {
        name: "Бесплотность",
        colour: "#55FFFF",
        trigger: "Пассивно",
        kind: "passive",
        rest: null,
        text: "<span>Каждый четвёртый удар проходит насквозь.</span> <span>Фантомы не трогают владельца.</span>"
      },
      {
        name: "Призрачная стая",
        colour: "#55FFFF",
        trigger: "ПКМ",
        kind: "rmb",
        rest: "12 с",
        text: "<span>Пять фантомов кружат вокруг вас, и круг</span> <span>всё шире. Задетый враг получает 6 урона.</span> Стая держится 5 секунд."
      }
    ],
    stats: "Урон 12 · Скорость 1.6",
    damage: 12,
    speed: 1.6,
    icon: "images/other/28b6759ee6.png",
    obtain: "Сокровищница Проклятого замка",
    method: "loot",
    methodLabel: "Находка",
    recipe: false
  },
  {
    kind: "weapon",
    id: "stars_edge",
    name: "Звёздная грань",
    rarity: "CELESTIAL_NIGHT",
    rarityLabel: "Небесная",
    line: "night",
    lore: [
      '<span style="color:#555555"><em>Её выковали из того, что падает с неба</em></span>',
      '<span style="color:#555555"><em>в ночь, когда луна полна.</em></span>'
    ],
    abilities: [
      {
        name: "Созвездие",
        colour: "#7F8BFF",
        trigger: "Пассивно",
        kind: "passive",
        rest: null,
        text: "<span>Каждый удар зажигает над целью звезду.</span> <span>Пятая складывает созвездие: +8 урона и слепота.</span>"
      },
      {
        name: "Звездопад",
        colour: "#7F8BFF",
        trigger: "ПКМ",
        kind: "rmb",
        rest: null,
        text: "<span>Туда, куда вы смотрите, падают 5 звёзд:</span> <span>каждая ранит и подбрасывает врагов рядом.</span> <span>Ночью звёзд вдвое больше. Раз в секунду.</span>"
      }
    ],
    stats: "Урон 13 · Скорость 1.6",
    damage: 13,
    speed: 1.6,
    icon: "images/other/eadcf5b768.png",
    obtain: "Ковка в Тёмном храме, в полнолуние",
    method: "forge",
    methodLabel: "Ковка у алтаря",
    recipe: false
  },
  {
    kind: "weapon",
    id: "requiem",
    name: "Реквием девятого неба",
    rarity: "CELESTIAL_NIGHT",
    rarityLabel: "Небесная",
    line: "night",
    lore: [
      '<span style="color:#555555"><em>Ночная фурия поднялась на девятое небо</em></span>',
      '<span style="color:#555555"><em>и вернулась оттуда косой.</em></span>'
    ],
    abilities: [
      {
        name: "Ночная песнь",
        colour: "#7F8BFF",
        trigger: "Пассивно",
        kind: "passive",
        rest: null,
        text: "<span>Ночью +2 урона.</span>"
      },
      {
        name: "Синяя туча",
        colour: "#7F8BFF",
        trigger: "ПКМ",
        kind: "rmb",
        rest: "45 с",
        text: "<span>На 10 секунд вы становитесь синей тучей:</span> <span>летаете, не получаете физического урона</span> <span>и бьёте на 4 каждого врага, сквозь</span> <span>которого пролетели.</span>"
      }
    ],
    stats: "Урон 15 · Скорость 1.2",
    damage: 15,
    speed: 1.2,
    icon: "images/other/f8ef121ebd.png",
    obtain: "Эволюция Ночной фурии в Тёмном храме",
    method: "evolve",
    methodLabel: "Эволюция у алтаря",
    recipe: false
  },
  {
    kind: "weapon",
    id: "excalibur",
    name: "Экскалибур",
    rarity: "CELESTIAL",
    rarityLabel: "Небесная",
    line: "sky",
    lore: [
      '<span style="color:#555555"><em>Его вынули из камня. Говорят, это был не камень,</em></span>',
      '<span style="color:#555555"><em>а ножны — и в них спало ещё что-то.</em></span>'
    ],
    abilities: [
      {
        name: "Благословение",
        colour: "#FFAA00",
        trigger: "Пассивно",
        kind: "passive",
        rest: null,
        text: "<span>По нежити +2 урона.</span>"
      },
      {
        name: "Клятва рыцаря",
        colour: "#FFAA00",
        trigger: "ПКМ",
        kind: "rmb",
        rest: "30 с",
        text: "<span>8 секунд силы I и сопротивления I.</span>"
      }
    ],
    stats: "Урон 12 · Скорость 1.6",
    damage: 12,
    speed: 1.6,
    icon: "images/other/a911f57db9.png",
    obtain: "Ковка в Небесном храме, днём",
    method: "forge",
    methodLabel: "Ковка у алтаря",
    recipe: false
  },
  {
    kind: "weapon",
    id: "true_excalibur",
    name: "Истинный Экскалибур",
    rarity: "CELESTIAL_NIGHT",
    rarityLabel: "Небесная",
    line: "night",
    lore: [
      '<span style="color:#555555"><em>Камень был лишь ножнами. Это — то,</em></span>',
      '<span style="color:#555555"><em>что в них спало, пока не пришёл достойный.</em></span>'
    ],
    abilities: [
      {
        name: "Свет святого",
        colour: "#FFAA00",
        trigger: "Пассивно",
        kind: "passive",
        rest: null,
        text: "<span>Каждый удар лечит вас на полсердца,</span> <span>по нежити — ещё +3 урона.</span>"
      },
      {
        name: "Ножны",
        colour: "#FFAA00",
        trigger: "Пассивно",
        kind: "passive",
        rest: null,
        text: "<span>Пока клинок в руке — сопротивление I.</span>"
      },
      {
        name: "Королевский суд",
        colour: "#FFAA00",
        trigger: "ПКМ",
        kind: "rmb",
        rest: "8 с",
        text: "<span>Золотая волна на 16 блоков вперёд: 14 урона</span> <span>врагам на пути, нежить вспыхивает. Вам — сила II</span> <span>на 5 секунд.</span>"
      }
    ],
    stats: "Урон 16 · Скорость 1.6",
    damage: 16,
    speed: 1.6,
    icon: "images/other/e470fbf77d.png",
    obtain: "Ковка в Тёмном храме: Экскалибур и Звёздная грань",
    method: "forge",
    methodLabel: "Ковка у алтаря",
    recipe: false
  },
  {
    kind: "weapon",
    id: "terra_blade",
    name: "Терра-блейд",
    rarity: "TERRA",
    rarityLabel: "Терра",
    line: "jungle",
    lore: [
      '<span style="color:#555555"><em>Лес вырастил его сам — из корней, света</em></span>',
      '<span style="color:#555555"><em>и всего, что в нём когда-то умерло.</em></span>'
    ],
    abilities: [
      {
        name: "Терра-лучи",
        colour: "#55FF55",
        trigger: "Зажать ПКМ",
        kind: "hold",
        rest: null,
        text: '<span>Пока кнопка зажата, клинок строчит зелёными лучами:</span> <span>1 урон и отравление первому, кого луч заденет.</span> <br><span style="color:#555555">Союзников лучи проходят насквозь.</span>'
      },
      {
        name: "Щит жизни",
        colour: "#55FF55",
        trigger: "Пассивно",
        kind: "passive",
        rest: null,
        text: "<span>Пока клинок в руке, вас окружает зелёный щит:</span> <span>любое исцеление вдвое сильнее.</span>"
      }
    ],
    stats: "Урон 12 · Скорость 1.6",
    damage: 12,
    speed: 1.6,
    icon: "images/other/bb4efe2f62.png",
    obtain: "Ковка в Храме джунглей",
    method: "forge",
    methodLabel: "Ковка у алтаря",
    recipe: false
  },
  {
    kind: "weapon",
    id: "ancient",
    name: "Древний",
    rarity: "TERRA",
    rarityLabel: "Терра",
    line: "terra",
    lore: [
      '<span style="color:#555555"><em>Его ковали, когда мир ещё был камнем,</em></span>',
      '<span style="color:#555555"><em>и камень помнит каждый его удар.</em></span>'
    ],
    abilities: [
      {
        name: "Гнев предков",
        colour: "#55FF55",
        trigger: "Пассивно",
        kind: "passive",
        rest: null,
        text: "<span>По разбойникам и ведьмам +4 урона.</span> <span>Каждый удар оплетает цель корнями:</span> <span>замедление II на 1,5 секунды.</span>"
      },
      {
        name: "Разлом",
        colour: "#55FF55",
        trigger: "ПКМ",
        kind: "rmb",
        rest: "20 с",
        text: "<span>Удар оземь: разлом бежит на 6 блоков вокруг —</span> <span>8 урона, подброс и корни на 3 секунды.</span> <span>Вам — поглощение II на 8 секунд.</span>"
      }
    ],
    stats: "Урон 11 · Скорость 1.6",
    damage: 11,
    speed: 1.6,
    icon: "images/icons/ancient.png",
    obtain: "Бочки Терра-подземелья",
    method: "loot",
    methodLabel: "Находка",
    recipe: false
  },
  {
    kind: "weapon",
    id: "enigma",
    name: "Энигма",
    rarity: "TERRA",
    rarityLabel: "Терра",
    line: "jungle",
    lore: [
      '<span style="color:#555555"><em>Предки не оставили ответа. Они оставили вопрос —</em></span>',
      '<span style="color:#555555"><em>и того, кто сможет его вынести.</em></span>'
    ],
    abilities: [
      {
        name: "Круг предков",
        colour: "#55FF55",
        trigger: "ПКМ",
        kind: "rmb",
        rest: "30 с",
        text: "<span>У ваших ног пульсирует круг предков.</span> <span>Свои в нём получают регенерацию III и сопротивление,</span> <span>вы — ещё и скорость. Враги в нём — отравление III.</span> Держится 10 секунд."
      },
      {
        name: "Печать загадки",
        colour: "#FFAA00",
        trigger: "Пассивно",
        kind: "passive",
        rest: null,
        text: "<span>Третий удар подряд по одной цели ломает печать:</span> <span>+6 урона и слабость на 5 секунд.</span>"
      },
      {
        name: "Завет предков",
        colour: "#FFAA00",
        trigger: "Пассивно",
        kind: "passive",
        rest: null,
        text: "<span>Когда здоровья меньше трети, предки заслоняют вас:</span> <span>поглощение II на 10 секунд, а союзникам рядом —</span> <span>сопротивление. Раз в минуту.</span>"
      }
    ],
    stats: "Урон 13 · Скорость 1.6",
    damage: 13,
    speed: 1.6,
    icon: "images/other/fd4a3c08f5.png",
    obtain: "Ковка в Храме джунглей",
    method: "forge",
    methodLabel: "Ковка у алтаря",
    recipe: false
  },
  {
    kind: "weapon",
    id: "celestial",
    name: "Селестиал",
    rarity: "TERRA",
    rarityLabel: "Терра",
    line: "jungle",
    lore: [
      '<span style="color:#555555"><em>Вопрос, на который предки наконец ответили.</em></span>'
    ],
    abilities: [
      {
        name: "Благодать",
        colour: "#55FF55",
        trigger: "Пассивно",
        kind: "passive",
        rest: null,
        text: "<span>Любое исцеление в 2,5 раза сильнее.</span>"
      },
      {
        name: "Метка неба",
        colour: "#55FF55",
        trigger: "При ударе",
        kind: "hit",
        rest: null,
        text: "<span>Цель светится зелёным 10 секунд: не исцеляется,</span> <span>получает больше урона, а часть вашего урона</span> <span>по ней возвращается вам здоровьем.</span>"
      },
      {
        name: "Разлом тверди",
        colour: "#55FF55",
        trigger: "ПКМ",
        kind: "rmb",
        rest: "40 с",
        text: "<span>Земля вокруг встаёт волной и оглушает врагов</span> <span>на 4 секунды.</span>"
      },
      {
        name: "Гнев небосвода",
        colour: "#55FF55",
        trigger: "Зажать ПКМ",
        kind: "hold",
        rest: "8 мин",
        text: "<span>Держите 7 секунд — и молнии бьют каждого врага</span> <span>вокруг: 40 урона каждому.</span>"
      }
    ],
    stats: "Урон 15 · Скорость 1.6",
    damage: 15,
    speed: 1.6,
    icon: "images/other/97fc9f3d00.png",
    obtain: "Эволюция Энигмы в Храме джунглей, 4-я форма крови предков",
    method: "evolve",
    methodLabel: "Эволюция у алтаря",
    recipe: false
  },
  {
    kind: "weapon",
    id: "cyber_blade",
    name: "Энцефало-меч",
    rarity: "TECHNO",
    rarityLabel: "Техно",
    line: "techno",
    lore: [
      '<span style="color:#555555"><em>Сталь, провод и красный свет. Фабрика дарит его</em></span>',
      '<span style="color:#555555"><em>каждому, кто впустил её в кровь.</em></span>'
    ],
    abilities: [
      {
        name: "Проводник",
        colour: "#FF5555",
        trigger: "Пассивно",
        kind: "passive",
        rest: null,
        text: "<span>Каждый пятый удар бьёт молнией ещё двух</span> <span>ближайших врагов в 5 блоках: по 4 урона.</span>"
      },
      {
        name: "Медный голем",
        colour: "#FF5555",
        trigger: "ПКМ",
        kind: "rmb",
        rest: null,
        text: '<span>Голем на 60 секунд бьёт тех, кого бьёте вы.</span> <br><span style="color:#555555">Снова — через 30 секунд после его гибели.</span>'
      },
      {
        name: "Отталкивающий луч",
        colour: "#FF5555",
        trigger: "Зажать ПКМ",
        kind: "hold",
        rest: null,
        text: '<span>Луч до самой стены: 0,5 урона и сильный отброс</span> <span>всех на пути; кто в нём остался, того несёт дальше.</span> <br><span style="color:#555555">Без перезарядки.</span>'
      }
    ],
    stats: "Урон 10 · Скорость 1.6",
    damage: 10,
    speed: 1.6,
    icon: "images/other/431234757a.png",
    obtain: "Дар Древней фабрики вместе с техноорганической кровью",
    method: "gift",
    methodLabel: "Дар святилища",
    recipe: false
  },
  {
    kind: "weapon",
    id: "cyber_katana",
    name: "Энцефало-клинок",
    rarity: "TECHNO",
    rarityLabel: "Техно",
    line: "techno",
    lore: [
      '<span style="color:#555555"><em>Второе поколение. Тоньше, быстрее,</em></span>',
      '<span style="color:#555555"><em>и в нём уже почти нет ошибок.</em></span>'
    ],
    abilities: [
      {
        name: "Проводник",
        colour: "#FF5555",
        trigger: "Пассивно",
        kind: "passive",
        rest: null,
        text: "<span>Каждый четвёртый удар бьёт молнией ещё трёх</span> <span>ближайших врагов в 5 блоках: по 5 урона.</span>"
      },
      {
        name: "Медные големы",
        colour: "#FF5555",
        trigger: "ПКМ",
        kind: "rmb",
        rest: null,
        text: '<span>Три голема на 60 секунд бьют тех, кого бьёте вы.</span> <br><span style="color:#555555">Снова — через 30 секунд после гибели последнего.</span>'
      },
      {
        name: "Лазеры",
        colour: "#FF5555",
        trigger: "Зажать ПКМ",
        kind: "hold",
        rest: null,
        text: "<span>Поток лазеров, по 1 урона. Без перезарядки.</span>"
      }
    ],
    stats: "Урон 12 · Скорость 1.6",
    damage: 12,
    speed: 1.6,
    icon: "images/other/9e6ab2b7b7.png",
    obtain: "Сам вырастает из Энцефало-меча",
    method: "grows",
    methodLabel: "Растёт сам",
    recipe: false
  },
  {
    kind: "weapon",
    id: "creation_splitter",
    name: "Антихрист",
    rarity: "TECHNO",
    rarityLabel: "Техно",
    line: "techno",
    lore: [
      '<span style="color:#555555"><em>На нём нет нитей. Его ковали, чтобы</em></span>',
      '<span style="color:#555555"><em>мир наконец заработал как следует.</em></span>'
    ],
    abilities: [
      {
        name: "Проводник",
        colour: "#FF5555",
        trigger: "Пассивно",
        kind: "passive",
        rest: null,
        text: "<span>Каждый третий удар бьёт молнией ещё четырёх</span> <span>ближайших врагов в 5 блоках: по 6 урона.</span>"
      },
      {
        name: "Нет предела совершенству",
        colour: "#FF5555",
        trigger: "Пассивно",
        kind: "passive",
        rest: null,
        text: "<span>Каждый разряд даёт +1 урона на 10 секунд,</span> <span>до +5 подряд.</span>"
      },
      {
        name: "Механический фантом",
        colour: "#FF5555",
        trigger: "При ударе",
        kind: "hit",
        rest: null,
        text: "<span>Удар посылает фантома на цель; нет его — зовёт.</span>"
      },
      {
        name: "Мировое Господство",
        colour: "#FFAA00",
        trigger: "Правый клик по блоку",
        kind: "other",
        rest: null,
        text: '<span>Поле на 20 блоков, пока не свернёте его тем же</span> <span>кликом. Вам и союзникам в нём — сопротивление,</span> <span>+50% урона, перезарядки на треть быстрее,</span> <span>и голод не тратит еду, кроме как на лечение.</span> <span>Каждая смерть в поле расширяет его на 2 блока.</span> <br><span style="color:#555555">Погибли с клинком — поле пало, рост сброшен,</span> <br><span style="color:#555555">минута до нового.</span>'
      },
      {
        name: "Лазерный луч",
        colour: "#FF5555",
        trigger: "Зажать ПКМ",
        kind: "hold",
        rest: null,
        text: "<span>Луч до стены, до 48 блоков: 3 урона всем</span> <span>на линии дважды в секунду. Без перезарядки.</span>"
      }
    ],
    stats: "Урон 14 · Скорость 1.6",
    damage: 14,
    speed: 1.6,
    icon: "images/other/e48e7744f6.png",
    obtain: "Сам вырастает из Энцефало-клинка",
    method: "grows",
    methodLabel: "Растёт сам",
    recipe: false
  },
  {
    kind: "weapon",
    id: "hyperion",
    name: "Hyperion",
    rarity: "CELESTIAL",
    rarityLabel: "Небесная",
    line: "sky",
    lore: [
      '<span style="color:#555555"><em>С ним расстояние перестаёт быть препятствием.</em></span>'
    ],
    abilities: [
      {
        name: "Странствие",
        colour: "#55FFFF",
        trigger: "ПКМ",
        kind: "rmb",
        rest: null,
        text: "<span>Подъём и толчок по направлению взгляда.</span> <span>Цельтесь выше и жмите снова — каждый рывок</span> <span>складывается с уже набранной скоростью.</span> <span>Падение после этого не ранит.</span>"
      }
    ],
    stats: "Урон 14 · Скорость 1.6",
    damage: 14,
    speed: 1.6,
    icon: "images/other/efaf7051a3.png",
    obtain: "Ковка в Небесном храме",
    method: "forge",
    methodLabel: "Ковка у алтаря",
    recipe: false
  },
  {
    kind: "material",
    id: "demon_soul",
    name: "Душа демона",
    rarity: "HELLISH",
    rarityLabel: "Адская",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Оно моргает. Это не отражение.</em></span>',
      "",
      '<span style="color:#AAAAAA">Вплавляется в клинок и меняет его природу —</span>',
      '<span style="color:#AAAAAA">на верстаке или у алтаря Незеритовой кузни.</span>',
      '<span style="color:#AAAAAA">Брошенная на крыше Незера, показывает путь</span>',
      '<span style="color:#AAAAAA">к Проклятому замку. Кровь с третьей формы.</span>'
    ],
    abilities: [],
    stats: "",
    obtain: "Сокровищница бастиона",
    icon: "images/icons/demon_soul.png",
    method: "loot",
    methodLabel: "Находка",
    recipe: false
  },
  {
    kind: "material",
    id: "terra_ingot",
    name: "Терра-слиток",
    rarity: "TERRA",
    rarityLabel: "Терра",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Алмаз, перекованный вокруг изумрудной жилы.</em></span>',
      "",
      '<span style="color:#AAAAAA">Металл, который не тупится.</span>'
    ],
    abilities: [],
    stats: "",
    obtain: "Крафт из алмаза и изумрудных блоков",
    icon: "images/icons/terra_ingot.png",
    method: "craft",
    methodLabel: "Верстак",
    recipe: true
  },
  {
    kind: "material",
    id: "wither_soul",
    name: "Душа Иссушителя",
    rarity: "SUPER_HELLISH",
    rarityLabel: "Супер-адская",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Три головы — и ни одной мысли, кроме голода.</em></span>',
      "",
      '<span style="color:#AAAAAA">Её отдают алтарю Незеритовой кузни вместе с Бедствием —</span>',
      '<span style="color:#AAAAAA">и оно становится Волей Демона.</span>'
    ],
    abilities: [],
    stats: "",
    obtain: "Иногда падает с Иссушителя",
    icon: "images/other/55344aa5c9.png",
    method: "drop",
    methodLabel: "Добыча",
    recipe: false
  },
  {
    kind: "material",
    id: "soul_shard",
    name: "Осколок души",
    rarity: "HELLISH",
    rarityLabel: "Адская",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Кусок того, что горело в кузне дольше, чем стоит мир.</em></span>',
      "",
      '<span style="color:#AAAAAA">Незеритовая кузня принимает его в уплату.</span>'
    ],
    abilities: [],
    stats: "",
    obtain: "Незеритовая кузня",
    icon: "images/icons/soul_shard.png",
    method: "place",
    methodLabel: "Святилище",
    recipe: false
  },
  {
    kind: "material",
    id: "celestial_shard",
    name: "Небесный осколок",
    rarity: "CELESTIAL",
    rarityLabel: "Небесная",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Свет, который упал и не разбился до конца.</em></span>',
      "",
      '<span style="color:#AAAAAA">Небесный и Тёмный храмы принимают его в уплату.</span>'
    ],
    abilities: [],
    stats: "",
    obtain: "Небесный и Тёмный храмы",
    icon: "images/icons/celestial_shard.png",
    method: "place",
    methodLabel: "Святилище",
    recipe: false
  },
  {
    kind: "material",
    id: "jungle_shard",
    name: "Реликтовый осколок",
    rarity: "TERRA",
    rarityLabel: "Терра",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Зелёный камень, который помнит, каким был лес до леса.</em></span>',
      "",
      '<span style="color:#AAAAAA">Храм джунглей принимает его в уплату.</span>'
    ],
    abilities: [],
    stats: "",
    obtain: "Храм джунглей",
    icon: "images/icons/jungle_shard.png",
    method: "place",
    methodLabel: "Святилище",
    recipe: false
  },
  {
    kind: "material",
    id: "warden_heart",
    name: "Сердце хранителя",
    rarity: "BLOODY",
    rarityLabel: "Кровавая",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Оно всё ещё слушает. Не шумите.</em></span>',
      "",
      '<span style="color:#AAAAAA">Падает с Хранителя, сражённого особым клинком.</span>',
      '<span style="color:#AAAAAA">Им питается Реквием девятого неба.</span>'
    ],
    abilities: [],
    stats: "",
    obtain: "Иногда падает с Хранителя",
    icon: "images/other/ab92445b9c.png",
    method: "drop",
    methodLabel: "Добыча",
    recipe: false
  },
  {
    kind: "material",
    id: "forge_heart",
    name: "Сердце кузни",
    rarity: "ULTRA_HELLISH",
    rarityLabel: "Ультра-адская",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Горнило остыло. Это — всё, что в нём ещё горит.</em></span>',
      "",
      '<span style="color:#AAAAAA">Нужно, чтобы перековать клинок в последнюю форму.</span>'
    ],
    abilities: [],
    stats: "",
    obtain: "Испытания Незеритовой кузни",
    icon: "images/icons/forge_heart.png",
    method: "trial",
    methodLabel: "Испытание",
    recipe: false
  },
  {
    kind: "material",
    id: "seraph_feather",
    name: "Перо серафима",
    rarity: "CELESTIAL",
    rarityLabel: "Небесная",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Он падал долго. Это перо падало дольше.</em></span>',
      "",
      '<span style="color:#AAAAAA">Небесный храм ценит его выше золота.</span>'
    ],
    abilities: [],
    stats: "",
    obtain: "Испытания Небесного храма",
    icon: "images/icons/seraph_feather.png",
    method: "trial",
    methodLabel: "Испытание",
    recipe: false
  },
  {
    kind: "material",
    id: "jungle_heart",
    name: "Сердце джунглей",
    rarity: "TERRA",
    rarityLabel: "Терра",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Оно всё ещё бьётся. Корни вокруг него — тоже.</em></span>',
      "",
      '<span style="color:#AAAAAA">Храм джунглей куёт из него Терра-блейд и Энигму.</span>'
    ],
    abilities: [],
    stats: "",
    obtain: "Испытания Храма джунглей",
    icon: "images/icons/jungle_heart.png",
    method: "trial",
    methodLabel: "Испытание",
    recipe: false
  },
  {
    kind: "material",
    id: "ancient_part",
    name: "Древняя деталь",
    rarity: "TECHNO",
    rarityLabel: "Техно",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Шестерня, которая всё ещё тёплая. Изнутри.</em></span>',
      "",
      '<span style="color:#AAAAAA">Терминал Древней фабрики принимает её в уплату.</span>'
    ],
    abilities: [],
    stats: "",
    obtain: "Древняя фабрика",
    icon: "images/icons/ancient_part.png",
    method: "place",
    methodLabel: "Святилище",
    recipe: false
  },
  {
    kind: "material",
    id: "night_seal",
    name: "Печать ночи",
    rarity: "CELESTIAL_NIGHT",
    rarityLabel: "Небесная",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Воск чёрный, оттиск — луна. Сломать её страшно.</em></span>',
      "",
      '<span style="color:#AAAAAA">Падает с Серафима третьего испытания.</span>',
      '<span style="color:#AAAAAA">Правый клик: небесная кровь третьей формы</span>',
      '<span style="color:#AAAAAA">станет ночной, а Небесный храм рухнет.</span>'
    ],
    abilities: [],
    stats: "",
    obtain: "Третье испытание Небесного храма",
    icon: "images/icons/night_seal.png",
    method: "trial",
    methodLabel: "Испытание",
    recipe: false
  },
  {
    kind: "material",
    id: "black_substance",
    name: "Чёрная субстанция",
    rarity: "ULTRA_HELLISH",
    rarityLabel: "Ультра-адская",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Она не отражает свет. Она его ест.</em></span>',
      "",
      '<span style="color:#AAAAAA">Висит в рамке над троном Проклятого замка.</span>',
      '<span style="color:#AAAAAA">Вместе с короной крови становится Все-Чёрным.</span>',
      '<span style="color:#AAAAAA">Техноорганическая кровь платит ею за четвёртую форму.</span>'
    ],
    abilities: [],
    stats: "",
    obtain: "Рамка над троном Проклятого замка",
    icon: "images/icons/black_substance.png",
    method: "place",
    methodLabel: "Святилище",
    recipe: false
  },
  {
    kind: "material",
    id: "terra_essence",
    name: "Терра-сущность",
    rarity: "TERRA",
    rarityLabel: "Терра",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Многогранник, в котором бьётся зелёное сердце земли.</em></span>',
      "",
      '<span style="color:#AAAAAA">Остаётся после Джунглевого голема в Терра-подземелье.</span>',
      '<span style="color:#AAAAAA">Ключ к четвёртой форме крови предков и часть Тессеракта.</span>',
      "",
      '<span style="color:#00AA00">Отравляет носящего — кроме крови предков и техноорганической.</span>'
    ],
    abilities: [],
    stats: "",
    obtain: "Большой зал Терра-подземелья, после Джунглевого голема",
    icon: "images/icons/terra_essence.png",
    method: "place",
    methodLabel: "Святилище",
    recipe: false
  },
  {
    kind: "material",
    id: "hell_essence",
    name: "Адская сущность",
    rarity: "SUPER_HELLISH",
    rarityLabel: "Супер-адская",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Многогранник, в котором тлеет красное сердце Незера.</em></span>',
      "",
      '<span style="color:#AAAAAA">Хранится в часовой башне Проклятого замка.</span>',
      '<span style="color:#AAAAAA">Ключ к четвёртой форме пепельной крови и часть Тессеракта.</span>',
      "",
      '<span style="color:#FF5555">Жжёт носящего; пепельной крови огонь не страшен.</span>'
    ],
    abilities: [],
    stats: "",
    obtain: "Часовая башня Проклятого замка",
    icon: "images/icons/hell_essence.png",
    method: "place",
    methodLabel: "Святилище",
    recipe: false
  },
  {
    kind: "material",
    id: "terra_compass",
    name: "Терра-компас",
    rarity: "TERRA",
    rarityLabel: "Терра",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Стрелку тянет вниз, под корни, к зелёному сердцу.</em></span>',
      "",
      '<span style="color:#AAAAAA">Указывает путь к Терра-подземелью.</span>',
      '<span style="color:#555555">Собирает кровь предков у алтаря Храма джунглей.</span>'
    ],
    abilities: [],
    stats: "",
    obtain: "Сборка кровью предков у алтаря Храма джунглей",
    icon: "images/icons/terra_compass.png",
    method: "assemble",
    methodLabel: "Сборка у алтаря",
    recipe: false
  },
  {
    kind: "material",
    id: "royal_clock",
    name: "Королевские часы",
    rarity: "SUPER_HELLISH",
    rarityLabel: "Супер-адская",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Стрелки стоят. Время идёт — для всех, кроме владельца.</em></span>',
      "",
      '<span style="color:#AAAAAA">Спасают от смерти, как тотем бессмертия,</span>',
      '<span style="color:#AAAAAA">и на 5 секунд останавливают время вокруг.</span>',
      '<span style="color:#AAAAAA">Падают с Проклятого короля.</span>'
    ],
    abilities: [],
    stats: "",
    obtain: "Проклятый король",
    icon: "images/icons/royal_clock.png",
    method: "drop",
    methodLabel: "Добыча",
    recipe: false
  },
  {
    kind: "material",
    id: "harbinger_core",
    name: "Ядро Предвестника",
    rarity: "TECHNO",
    rarityLabel: "Техно",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Оно тикает. Не как часы — как сердце.</em></span>',
      "",
      '<span style="color:#AAAAAA">Всё, что осталось от Предвестника.</span>'
    ],
    abilities: [],
    stats: "",
    obtain: "Предвестник Древней фабрики",
    icon: "images/icons/harbinger_core.png",
    method: "drop",
    methodLabel: "Добыча",
    recipe: false
  },
  {
    kind: "material",
    id: "copper_automaton",
    name: "Призывной медный голем",
    rarity: "TECHNO",
    rarityLabel: "Техно",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Сложен в ладонь. Развернётся сам.</em></span>',
      "",
      '<span style="color:#AAAAAA">Правый клик: медный голем на 60 секунд,</span>',
      '<span style="color:#AAAAAA">как у Энцефало-меча. Предмет тратится.</span>'
    ],
    abilities: [],
    stats: "",
    obtain: "Сборка на алтаре Древней фабрики",
    icon: "images/other/6f71e94f18.png",
    method: "assemble",
    methodLabel: "Сборка у алтаря",
    recipe: false
  },
  {
    kind: "material",
    id: "mini_harbinger",
    name: "Призывной малый Предвестник",
    rarity: "TECHNO",
    rarityLabel: "Техно",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Маленький. Злой. Помнит своего создателя.</em></span>',
      "",
      '<span style="color:#AAAAAA">Правый клик: малый Предвестник на 60 секунд,</span>',
      '<span style="color:#AAAAAA">с лучом смерти и ракетами. Предмет тратится.</span>'
    ],
    abilities: [],
    stats: "",
    obtain: "Сборка на алтаре Древней фабрики",
    icon: "images/other/897fc1caae.png",
    method: "assemble",
    methodLabel: "Сборка у алтаря",
    recipe: false
  },
  {
    kind: "material",
    id: "terra_magnet",
    name: "Терра-магнит",
    rarity: "TERRA",
    rarityLabel: "Терра",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Зелёный металл помнит, где лежит всё живое.</em></span>'
    ],
    abilities: [
      {
        name: "Притяжение",
        colour: "#55FF55",
        trigger: "ПКМ",
        kind: "rmb",
        rest: "1 с",
        text: "<span>Тянет к вам существо или лежащий предмет, пока</span> <span>магнит в руке. Повторный клик отпускает.</span> <span>Кровь предков, с третьей формы.</span>"
      }
    ],
    stats: "",
    obtain: "Ковка у алтаря Храма джунглей: 16 терра-слитков, 64 реликтовых осколка; кровь предков с 3-й формы",
    icon: "images/other/aad712b223.png",
    method: "forge",
    methodLabel: "Ковка у алтаря",
    recipe: false
  },
  {
    kind: "material",
    id: "jungle_box",
    name: "Джунглевая коробка",
    rarity: "TERRA",
    rarityLabel: "Терра",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Из щелей пахнет болотом. Кто-то внутри шуршит.</em></span>'
    ],
    abilities: [
      {
        name: "Болотная свита",
        colour: "#55FF55",
        trigger: "ПКМ",
        kind: "rmb",
        rest: "4 мин",
        text: "<span>Три болотника на минуту бьются за вас, а ведьма</span> <span>держится рядом и бросает в вас зелья исцеления,</span> <span>когда вы ранены. Только кровь предков.</span>"
      }
    ],
    stats: "",
    obtain: "Ковка у алтаря Храма джунглей: 128 реликтовых осколков, кровь предков",
    icon: "images/other/96e6dd50fd.png",
    method: "forge",
    methodLabel: "Ковка у алтаря",
    recipe: false
  },
  {
    kind: "material",
    id: "angel_box",
    name: "Ангельская шкатулка",
    rarity: "CELESTIAL",
    rarityLabel: "Небесная",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Её открывают тихо: внутри поют.</em></span>'
    ],
    abilities: [
      {
        name: "Небесный хор",
        colour: "#55FFFF",
        trigger: "ПКМ",
        kind: "rmb",
        rest: "4 мин",
        text: "<span>Пять ангелов-вредин на минуту бьются за вас.</span> <span>Небесная и ночная небесная кровь.</span>"
      }
    ],
    stats: "",
    obtain: "Ковка у алтаря Небесного или Тёмного храма: 128 небесных осколков, небесная или ночная кровь",
    icon: "images/other/5e62065f22.png",
    method: "forge",
    methodLabel: "Ковка у алтаря",
    recipe: false
  },
  {
    kind: "material",
    id: "ash_box",
    name: "Тайник пепла",
    rarity: "SUPER_HELLISH",
    rarityLabel: "Супер-адская",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Обугленный сундучок. Тёплый, даже зимой.</em></span>'
    ],
    abilities: [
      {
        name: "Стража пекла",
        colour: "#FFAA00",
        trigger: "ПКМ",
        kind: "rmb",
        rest: "4 мин",
        text: "<span>Брут и два скелета-иссушителя на минуту</span> <span>бьются за вас. Только пепельная кровь.</span>"
      }
    ],
    stats: "",
    obtain: "Ковка у алтаря Незеритовой кузни: 128 осколков души, пепельная кровь",
    icon: "images/other/be49e055b5.png",
    method: "forge",
    methodLabel: "Ковка у алтаря",
    recipe: false
  },
  {
    kind: "material",
    id: "tarot_hierophant",
    name: "V — Иерофант",
    rarity: "CELESTIAL",
    rarityLabel: "Небесная",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Ангел трубит — и стрелы не долетают.</em></span>'
    ],
    abilities: [
      {
        name: "Аура воздуха",
        colour: "#FFFFFF",
        trigger: "ПКМ",
        kind: "rmb",
        rest: "2 мин",
        text: "<span>15 секунд скорости, и снаряды отскакивают от вас —</span> <span>кроме лечебных зелий союзников. Ближний бой</span> <span>бьёт как обычно. Карта тратится.</span> <span>Небесная и ночная кровь, со второй формы.</span>"
      }
    ],
    stats: "",
    obtain: "Ковка у алтаря Небесного или Тёмного храма: 32 небесных осколка, 8 бумаги, 2 голубых красителя; небесная или ночная кровь со 2-й формы",
    icon: "images/other/bdde4e2356.png",
    method: "forge",
    methodLabel: "Ковка у алтаря",
    recipe: false
  },
  {
    kind: "material",
    id: "tarot_justice",
    name: "VIII — Правосудие",
    rarity: "CELESTIAL",
    rarityLabel: "Небесная",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Весы не видят, чья рана. Они делят.</em></span>'
    ],
    abilities: [
      {
        name: "Общая чаша",
        colour: "#FFAA00",
        trigger: "ПКМ",
        kind: "rmb",
        rest: "2 мин, общая с Иерофантом",
        text: "<span>На 15 секунд связывает вас с союзниками рядом:</span> <span>урон по любому из вас делится поровну на всех.</span> <span>Карта тратится.</span> <span>Небесная и ночная кровь, со второй формы.</span>"
      }
    ],
    stats: "",
    obtain: "Ковка у алтаря Небесного или Тёмного храма: 32 небесных осколка, 8 бумаги, 2 голубых красителя; небесная или ночная кровь со 2-й формы",
    icon: "images/other/d7be5a344a.png",
    method: "forge",
    methodLabel: "Ковка у алтаря",
    recipe: false
  },
  {
    kind: "material",
    id: "tarot_moon",
    name: "XVIII — Луна",
    rarity: "CELESTIAL",
    rarityLabel: "Небесная",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Чёрная луна течёт на землю. Все глаза — на тебя.</em></span>'
    ],
    abilities: [
      {
        name: "Чёрная луна",
        colour: "#00AAAA",
        trigger: "ПКМ",
        kind: "rmb",
        rest: "10 мин — одна на весь сервер",
        text: "<span>На 15 секунд наступает ночь, и вы стоите твёрдо:</span> <span>сопротивление, 20 жёлтых сердец, регенерация —</span> <span>и все враждебные мобы рядом идут на вас.</span> <span>Карта тратится. Ночная кровь, с третьей формы.</span>"
      }
    ],
    stats: "",
    obtain: "Ковка у алтаря Тёмного храма: 64 небесных осколка, 12 чёрных красителей, 16 кварца, тотем бессмертия; ночная кровь с 3-й формы",
    icon: "images/other/725891b28f.png",
    method: "forge",
    methodLabel: "Ковка у алтаря",
    recipe: false
  },
  {
    kind: "material",
    id: "assembly_dome",
    name: "Сборочный купол",
    rarity: "TECHNO",
    rarityLabel: "Техно",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Внутри него — целый цех. Сложенный.</em></span>',
      "",
      '<span style="color:#AAAAAA">Правый клик: купол на минуту. В нём собираются</span>',
      '<span style="color:#AAAAAA">автоматоны и бьют врагов. Предмет не тратится.</span>',
      '<span style="color:#555555">Перезарядка 2 минуты.</span>'
    ],
    abilities: [],
    stats: "",
    obtain: "Сборка на алтаре Древней фабрики",
    icon: "images/other/23434c7088.png",
    method: "assemble",
    methodLabel: "Сборка у алтаря",
    recipe: false
  },
  {
    kind: "material",
    id: "wanderer_cube",
    name: "Тессеракт",
    rarity: "ULTRA_HELLISH",
    rarityLabel: "Ультра-адская",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Земля и пекло, запертые в одной грани.</em></span>'
    ],
    abilities: [
      {
        name: "Правый клик",
        colour: "#FFAA00",
        trigger: "Цвет подсказывает, что будет",
        kind: "other",
        rest: null,
        text: '<span style="color:#FF5555">Красный</span><span> — в чужом куполе, поле, эдикте или</span> <span>под чужой Луной: развеивает их.</span> <br><span style="color:#55FF55">Зелёный</span><span> — не всё здоровье: +50% вам и своим рядом.</span> <br><span style="color:#55FFFF">Голубой</span><span> — в мире: к случайному храму.</span> <br><span style="color:#FFAA00">Оранжевый</span><span> — в Незере: к Незеритовой кузне.</span> <br><span style="color:#FF55FF">Фиолетовый</span><span> — в Энде: к точке возрождения.</span> <span>Переносит всех в круге рядом; круг горит</span> <span>ещё немного и забирает вошедших.</span> <br><span style="color:#555555">Серый — перезарядка: 10 минут, лечение — 5.</span>'
      }
    ],
    stats: "",
    obtain: "Крафт: Терра-сущность, звезда Незера, Адская сущность, 6 плачущих обсидианов",
    icon: "images/icons/wanderer_cube.png",
    method: "craft",
    methodLabel: "Верстак",
    recipe: true
  },
  {
    kind: "material",
    id: "lord_soul",
    name: "Душа лорда",
    rarity: "SUPER_HELLISH",
    rarityLabel: "Супер-адская",
    line: "material",
    lore: [
      '<span style="color:#555555"><em>Горнило не умирает. Оно отдаёт то, что в нём горело.</em></span>',
      "",
      '<span style="color:#AAAAAA">Остаётся там, где пало Горнило</span>',
      '<span style="color:#AAAAAA">третьего испытания Незеритовой кузни.</span>',
      '<span style="color:#AAAAAA">Из неё, незеритовой брони и 64 осколков души</span>',
      '<span style="color:#AAAAAA">кузня отливает Расплавленный доспех.</span>'
    ],
    abilities: [],
    stats: "",
    obtain: "Горнило третьего испытания Незеритовой кузни",
    icon: "images/icons/lord_soul.png",
    method: "place",
    methodLabel: "Святилище",
    recipe: false
  }
];
const altar = [
  {
    kind: "evolve",
    result: "calamity",
    from: "doom",
    at: "Незеритовая кузня",
    time: "",
    blood: "",
    form: 0,
    costs: [
      {
        key: "soul_shard",
        n: 8
      },
      {
        key: "demon_soul",
        n: 1
      }
    ]
  },
  {
    kind: "evolve",
    result: "demon_will",
    from: "calamity",
    at: "Незеритовая кузня",
    time: "",
    blood: "",
    form: 0,
    costs: [
      {
        key: "soul_shard",
        n: 16
      },
      {
        key: "wither_soul",
        n: 1
      }
    ]
  },
  {
    kind: "evolve",
    result: "imperium",
    from: "demon_will",
    at: "Незеритовая кузня",
    time: "",
    blood: "",
    form: 0,
    costs: [
      {
        key: "forge_heart",
        n: 1
      },
      {
        key: "soul_shard",
        n: 64
      }
    ]
  },
  {
    kind: "evolve",
    result: "grave_splitter",
    from: "demon_slayer",
    at: "Незеритовая кузня",
    time: "",
    blood: "",
    form: 0,
    costs: [
      {
        key: "soul_shard",
        n: 32
      },
      {
        key: "v:netherite_ingot",
        n: 1
      }
    ]
  },
  {
    kind: "evolve",
    result: "celestial",
    from: "enigma",
    at: "Храм джунглей",
    time: "",
    blood: "Кровь предков",
    form: 4,
    costs: [
      {
        key: "terra_ingot",
        n: 24
      }
    ]
  },
  {
    kind: "evolve",
    result: "nocturne",
    from: "solstice",
    at: "Тёмный храм",
    time: "",
    blood: "",
    form: 0,
    costs: [
      {
        key: "celestial_shard",
        n: 16
      },
      {
        key: "v:lapis_block",
        n: 8
      }
    ]
  },
  {
    kind: "evolve",
    result: "requiem",
    from: "nocturne",
    at: "Тёмный храм",
    time: "",
    blood: "",
    form: 0,
    costs: [
      {
        key: "celestial_shard",
        n: 64
      },
      {
        key: "seraph_feather",
        n: 1
      },
      {
        key: "warden_heart",
        n: 1
      }
    ]
  },
  {
    kind: "evolve",
    result: "all_black",
    from: "lucifer",
    at: "Незеритовая кузня",
    time: "",
    blood: "Пепельная кровь",
    form: 4,
    costs: [
      {
        key: "black_substance",
        n: 1
      }
    ]
  },
  {
    kind: "evolve",
    result: "all_black",
    from: "true_excalibur",
    at: "Тёмный храм",
    time: "",
    blood: "Ночная небесная кровь",
    form: 4,
    costs: [
      {
        key: "black_substance",
        n: 1
      }
    ]
  },
  {
    kind: "evolve",
    result: "all_black",
    from: "celestial",
    at: "Храм джунглей",
    time: "",
    blood: "Кровь предков",
    form: 4,
    costs: [
      {
        key: "black_substance",
        n: 1
      }
    ]
  },
  {
    kind: "evolve",
    result: "all_black",
    from: "creation_splitter",
    at: "Древняя фабрика",
    time: "",
    blood: "Техноорганическая кровь",
    form: 4,
    costs: [
      {
        key: "black_substance",
        n: 1
      }
    ]
  },
  {
    kind: "forge",
    result: "hyperion",
    at: "Небесный храм",
    time: "",
    blood: "",
    form: 0,
    costs: [
      {
        key: "celestial_shard",
        n: 40
      },
      {
        key: "seraph_feather",
        n: 1
      },
      {
        key: "v:ender_pearl",
        n: 16
      }
    ]
  },
  {
    kind: "forge",
    result: "nocturne",
    at: "Тёмный храм",
    time: "",
    blood: "",
    form: 0,
    costs: [
      {
        key: "celestial_shard",
        n: 40
      },
      {
        key: "seraph_feather",
        n: 1
      },
      {
        key: "v:lapis_block",
        n: 8
      }
    ]
  },
  {
    kind: "forge",
    result: "excalibur",
    at: "Небесный храм",
    time: "только днём",
    blood: "",
    form: 0,
    costs: [
      {
        key: "celestial_shard",
        n: 40
      },
      {
        key: "seraph_feather",
        n: 1
      },
      {
        key: "v:diamond_block",
        n: 4
      },
      {
        key: "v:gold_block",
        n: 4
      }
    ]
  },
  {
    kind: "forge",
    result: "stars_edge",
    at: "Тёмный храм",
    time: "только в полнолуние, ночью",
    blood: "",
    form: 0,
    costs: [
      {
        key: "celestial_shard",
        n: 48
      },
      {
        key: "seraph_feather",
        n: 1
      },
      {
        key: "v:nether_star",
        n: 1
      },
      {
        key: "v:amethyst_shard",
        n: 16
      }
    ]
  },
  {
    kind: "forge",
    result: "true_excalibur",
    at: "Тёмный храм",
    time: "",
    blood: "",
    form: 0,
    costs: [
      {
        key: "excalibur",
        n: 1
      },
      {
        key: "stars_edge",
        n: 1
      }
    ]
  },
  {
    kind: "forge",
    result: "ash_box",
    at: "Незеритовая кузня",
    time: "",
    blood: "Пепельная кровь",
    form: 1,
    costs: [
      {
        key: "soul_shard",
        n: 128
      }
    ]
  },
  {
    kind: "forge",
    result: "angel_box",
    at: "Небесный храм",
    time: "",
    blood: "Небесная кровь",
    form: 1,
    costs: [
      {
        key: "celestial_shard",
        n: 128
      }
    ]
  },
  {
    kind: "forge",
    result: "angel_box",
    at: "Тёмный храм",
    time: "",
    blood: "Ночная небесная кровь",
    form: 1,
    costs: [
      {
        key: "celestial_shard",
        n: 128
      }
    ]
  },
  {
    kind: "forge",
    result: "tarot_hierophant",
    at: "Небесный храм",
    time: "",
    blood: "Небесная кровь",
    form: 2,
    costs: [
      {
        key: "celestial_shard",
        n: 32
      },
      {
        key: "v:paper",
        n: 8
      },
      {
        key: "v:light_blue_dye",
        n: 2
      }
    ]
  },
  {
    kind: "forge",
    result: "tarot_justice",
    at: "Небесный храм",
    time: "",
    blood: "Небесная кровь",
    form: 2,
    costs: [
      {
        key: "celestial_shard",
        n: 32
      },
      {
        key: "v:paper",
        n: 8
      },
      {
        key: "v:light_blue_dye",
        n: 2
      }
    ]
  },
  {
    kind: "forge",
    result: "tarot_hierophant",
    at: "Тёмный храм",
    time: "",
    blood: "Ночная небесная кровь",
    form: 2,
    costs: [
      {
        key: "celestial_shard",
        n: 32
      },
      {
        key: "v:paper",
        n: 8
      },
      {
        key: "v:light_blue_dye",
        n: 2
      }
    ]
  },
  {
    kind: "forge",
    result: "tarot_justice",
    at: "Тёмный храм",
    time: "",
    blood: "Ночная небесная кровь",
    form: 2,
    costs: [
      {
        key: "celestial_shard",
        n: 32
      },
      {
        key: "v:paper",
        n: 8
      },
      {
        key: "v:light_blue_dye",
        n: 2
      }
    ]
  },
  {
    kind: "forge",
    result: "tarot_moon",
    at: "Тёмный храм",
    time: "",
    blood: "Ночная небесная кровь",
    form: 3,
    costs: [
      {
        key: "celestial_shard",
        n: 64
      },
      {
        key: "v:black_dye",
        n: 12
      },
      {
        key: "v:quartz",
        n: 16
      },
      {
        key: "v:totem_of_undying",
        n: 1
      }
    ]
  },
  {
    kind: "forge",
    result: "jungle_box",
    at: "Храм джунглей",
    time: "",
    blood: "Кровь предков",
    form: 1,
    costs: [
      {
        key: "jungle_shard",
        n: 128
      }
    ]
  },
  {
    kind: "forge",
    result: "copper_automaton",
    at: "Древняя фабрика",
    time: "",
    blood: "Техноорганическая кровь",
    form: 2,
    costs: [
      {
        key: "v:copper_block",
        n: 2
      },
      {
        key: "ancient_part",
        n: 10
      }
    ]
  },
  {
    kind: "forge",
    result: "mini_harbinger",
    at: "Древняя фабрика",
    time: "",
    blood: "Техноорганическая кровь",
    form: 3,
    costs: [
      {
        key: "v:iron_block",
        n: 4
      },
      {
        key: "ancient_part",
        n: 20
      }
    ]
  },
  {
    kind: "forge",
    result: "assembly_dome",
    at: "Древняя фабрика",
    time: "",
    blood: "Техноорганическая кровь",
    form: 4,
    costs: [
      {
        key: "v:iron_block",
        n: 5
      },
      {
        key: "v:redstone_block",
        n: 5
      },
      {
        key: "ancient_part",
        n: 20
      }
    ]
  },
  {
    kind: "forge",
    result: "terra_blade",
    at: "Храм джунглей",
    time: "",
    blood: "",
    form: 0,
    costs: [
      {
        key: "jungle_shard",
        n: 40
      },
      {
        key: "jungle_heart",
        n: 1
      },
      {
        key: "terra_ingot",
        n: 8
      }
    ]
  },
  {
    kind: "forge",
    result: "terra_compass",
    at: "Храм джунглей",
    time: "",
    blood: "Кровь предков",
    form: 1,
    costs: [
      {
        key: "v:compass",
        n: 1
      },
      {
        key: "terra_ingot",
        n: 8
      }
    ]
  },
  {
    kind: "forge",
    result: "terra_magnet",
    at: "Храм джунглей",
    time: "",
    blood: "Кровь предков",
    form: 3,
    costs: [
      {
        key: "terra_ingot",
        n: 16
      },
      {
        key: "jungle_shard",
        n: 64
      }
    ]
  },
  {
    kind: "forge",
    result: "enigma",
    at: "Храм джунглей",
    time: "",
    blood: "",
    form: 0,
    costs: [
      {
        key: "jungle_shard",
        n: 48
      },
      {
        key: "jungle_heart",
        n: 1
      },
      {
        key: "terra_ingot",
        n: 4
      },
      {
        key: "v:emerald_block",
        n: 16
      }
    ]
  }
];
const chains = [
  {
    key: "hell",
    title: "Адская линия",
    entries: [
      {
        id: "doom",
        sep: ""
      },
      {
        id: "calamity",
        sep: "→"
      },
      {
        id: "demon_will",
        sep: "→"
      },
      {
        id: "imperium",
        sep: "→"
      }
    ]
  },
  {
    key: "cleaver",
    title: "Резаки",
    entries: [
      {
        id: "cutter",
        sep: ""
      },
      {
        id: "demonic_cutter",
        sep: "→"
      },
      {
        id: "terra_cutter",
        sep: "→"
      }
    ]
  },
  {
    key: "blood",
    title: "Кровавая линия",
    entries: [
      {
        id: "arachnid",
        sep: ""
      },
      {
        id: "demon_slayer",
        sep: "→"
      },
      {
        id: "grave_splitter",
        sep: "→"
      },
      {
        id: "lucifer",
        sep: "→"
      }
    ]
  },
  {
    key: "axe",
    title: "Секиры",
    entries: [
      {
        id: "gloomsteel_axe",
        sep: ""
      },
      {
        id: "berserker_axe",
        sep: "→"
      },
      {
        id: "phoenix_axe",
        sep: "или"
      }
    ]
  },
  {
    key: "sky",
    title: "Небесные клинки",
    entries: [
      {
        id: "hyperion",
        sep: ""
      },
      {
        id: "solstice",
        sep: ""
      },
      {
        id: "phantomguard",
        sep: ""
      },
      {
        id: "excalibur",
        sep: ""
      }
    ]
  },
  {
    key: "night",
    title: "Небесная ночь",
    entries: [
      {
        id: "stars_edge",
        sep: ""
      },
      {
        id: "solstice",
        sep: "·"
      },
      {
        id: "nocturne",
        sep: "→"
      },
      {
        id: "requiem",
        sep: "→"
      },
      {
        id: "excalibur",
        sep: "·"
      },
      {
        id: "true_excalibur",
        sep: "→"
      }
    ]
  },
  {
    key: "jungle",
    title: "Ковка в джунглях",
    entries: [
      {
        id: "terra_blade",
        sep: ""
      },
      {
        id: "enigma",
        sep: ""
      },
      {
        id: "celestial",
        sep: "→"
      }
    ]
  },
  {
    key: "terra",
    title: "Терра-подземелье",
    entries: [
      {
        id: "ancient",
        sep: ""
      }
    ]
  },
  {
    key: "techno",
    title: "Техноорганическая кровь",
    entries: [
      {
        id: "cyber_blade",
        sep: ""
      },
      {
        id: "cyber_katana",
        sep: "→"
      },
      {
        id: "creation_splitter",
        sep: "→"
      }
    ]
  },
  {
    key: "abyss",
    title: "Бездна: корона своей крови + Чёрная субстанция",
    entries: [
      {
        id: "lucifer",
        sep: ""
      },
      {
        id: "celestial",
        sep: "или"
      },
      {
        id: "true_excalibur",
        sep: "или"
      },
      {
        id: "creation_splitter",
        sep: "или"
      },
      {
        id: "all_black",
        sep: "→"
      }
    ]
  }
];
const hotbar = [
  "all_black",
  "lucifer",
  "enigma",
  "solstice",
  "nocturne",
  "phoenix_axe",
  "terra_blade",
  "phantomguard",
  "hyperion"
];
const achievements = [
  {
    title: "Адская линия и Все-Чёрный",
    cards: [
      {
        key: "cold_steel",
        title: "Холодная сталь",
        description: "В ней нет ничего, кроме холода. Пока что.",
        frame: "task",
        frameLabel: "Задача",
        condition: "Получить Погибель",
        icon: "images/other/72806b35de.png",
        caption: "Погибель"
      },
      {
        key: "it_blinks",
        title: "Оно моргает",
        description: "Твоя жизнь никогда не станет прежней.",
        frame: "task",
        frameLabel: "Задача",
        condition: "Получить Душу демона",
        icon: "images/icons/demon_soul.png",
        caption: "Душа демона"
      },
      {
        key: "two_hearts",
        title: "Два сердца",
        description: "Одно из них твоё. Второе бьётся быстрее и терпения не имеет.",
        frame: "task",
        frameLabel: "Задача",
        condition: "Создать Бедствие",
        icon: "images/other/a4a3c2e4f9.png",
        caption: "Бедствие"
      },
      {
        key: "wither_legacy",
        title: "Наследство Иссушителя",
        description: "Он не умер. Его переложили — в то, что ты теперь носишь.",
        frame: "goal",
        frameLabel: "Цель",
        condition: "Забрать Душу Иссушителя",
        icon: "images/other/55344aa5c9.png",
        caption: "Душа Иссушителя"
      },
      {
        key: "insight",
        title: "Прозрение",
        description: "Всё, что дышит вокруг, уже знает, что ты смотришь.",
        frame: "task",
        frameLabel: "Задача",
        condition: "Подсветить Прозрением 20 существ разом",
        icon: "images/guide/minecraft:spyglass.png",
        caption: "Подзорная труба"
      },
      {
        key: "genocide",
        title: "Геноцид",
        description: "Но никто не пришёл",
        frame: "challenge",
        frameLabel: "Испытание",
        condition: "Выковать Все-Чёрный",
        icon: "images/guide/minecraft:wither_skeleton_skull.png",
        caption: "Череп скелета-иссушителя"
      },
      {
        key: "death_knocked",
        title: "Смерть постучалась",
        description: "Она приходила. Ты был занят.",
        frame: "task",
        frameLabel: "Задача",
        condition: "Пережить смертельный удар, держа Все-Чёрный",
        icon: "images/guide/totem_of_undying.png",
        caption: "Тотем бессмертия"
      },
      {
        key: "he_returned",
        title: "Он вернулся",
        description: "Он всегда возвращается",
        frame: "task",
        frameLabel: "Задача",
        condition: "Подобрать привязанный клинок после своей смерти",
        icon: "images/other/63ca5f7c3f.png",
        caption: "Все-Чёрный"
      },
      {
        key: "not_rubber",
        title: "Я не резиновый",
        description: "Ни одного зрителя. Все — участники.",
        frame: "challenge",
        frameLabel: "Испытание",
        condition: "Собрать на себе 30 существ разом",
        icon: "images/guide/minecraft:zombie_head.png",
        caption: "Голова зомби"
      },
      {
        key: "harmless_pet",
        title: "Безобидная зверюшка",
        description: "Слепое, сильное, безупречное. И всё-таки кончилось.",
        frame: "challenge",
        frameLabel: "Испытание",
        condition: "Убить Вардена Все-Чёрным",
        icon: "images/guide/minecraft:sculk_shrieker.png",
        caption: "Скалк-крикун"
      },
      {
        key: "holy_promise",
        title: "Святое обещание",
        description: "Три мира видели тебя с ним в руке. Ни один не стал лучше.",
        frame: "goal",
        frameLabel: "Цель",
        condition: "Побывать с Все-Чёрным во всех трёх измерениях",
        icon: "images/guide/minecraft:ender_eye.png",
        caption: "Око Края"
      }
    ]
  },
  {
    title: "Резаки и джунгли",
    cards: [
      {
        key: "butcher",
        title: "Инструмент мясника",
        description: "Кто-то унёс его под землю и не вернулся. Ты вернулся.",
        frame: "task",
        frameLabel: "Задача",
        condition: "Получить Резак",
        icon: "images/other/9adf817a26.png",
        caption: "Резак"
      },
      {
        key: "wider",
        title: "Шире",
        description: "Лезвие потемнело. Теперь оно берёт то, до чего раньше не доставало.",
        frame: "task",
        frameLabel: "Задача",
        condition: "Создать Демонический резак",
        icon: "images/other/9499d8c8aa.png",
        caption: "Демонический резак"
      },
      {
        key: "green_metal",
        title: "Зелёный металл",
        description: "Он не тупится. В отличие от того, кто его держит.",
        frame: "task",
        frameLabel: "Задача",
        condition: "Получить терра-слиток",
        icon: "images/icons/terra_ingot.png",
        caption: "Терра-слиток"
      },
      {
        key: "tireless_harvest",
        title: "Жатва без устали",
        description: "Он не спросит, что именно ты им режешь. Никогда не спрашивал.",
        frame: "goal",
        frameLabel: "Цель",
        condition: "Создать Терра-резак",
        icon: "images/other/2808503131.png",
        caption: "Терра-резак"
      },
      {
        key: "vein",
        title: "Жила",
        description: "Из мёртвых сыплются камни. Мир находит это справедливым.",
        frame: "goal",
        frameLabel: "Цель",
        condition: "Выбить Терра-резаком 100 изумрудов",
        icon: "images/guide/emerald.png",
        caption: "Изумруд"
      },
      {
        key: "forest_breath",
        title: "Дыхание леса",
        description: "Лес вырастил клинок и отдал его тебе. Лес ничего не отдаёт даром.",
        frame: "goal",
        frameLabel: "Цель",
        condition: "Выковать Терра-блейд",
        icon: "images/other/bb4efe2f62.png",
        caption: "Терра-блейд"
      },
      {
        key: "riddle",
        title: "Загадка предков",
        description: "Они не оставили ответа. Только вопрос — и тебя, чтобы его нести.",
        frame: "goal",
        frameLabel: "Цель",
        condition: "Выковать Энигму",
        icon: "images/other/fd4a3c08f5.png",
        caption: "Энигма"
      }
    ]
  },
  {
    title: "Небесная ночь",
    cards: [
      {
        key: "night_let_in",
        title: "Ночь впущена",
        description: "Ты сломал печать, и небо рухнуло.",
        frame: "goal",
        frameLabel: "Цель",
        condition: "Сломать Печать ночи",
        icon: "images/icons/night_seal.png",
        caption: "Печать ночи"
      },
      {
        key: "starfall",
        title: "Звездопад",
        description: "Звёзды упали. Загадывай желания.",
        frame: "goal",
        frameLabel: "Цель",
        condition: "Выковать Звёздную грань",
        icon: "images/other/eadcf5b768.png",
        caption: "Звёздная грань"
      },
      {
        key: "ninth_circle",
        title: "Девятое небо",
        description: "Туда не поднимаются дважды.",
        frame: "goal",
        frameLabel: "Цель",
        condition: "Получить Реквием девятого неба",
        icon: "images/other/f8ef121ebd.png",
        caption: "Реквием девятого неба"
      },
      {
        key: "worthy",
        title: "Достойный",
        description: "Меч выбрал руку. Постарайся, чтобы он не пожалел.",
        frame: "challenge",
        frameLabel: "Испытание",
        condition: "Получить Истинный Экскалибур",
        icon: "images/other/e470fbf77d.png",
        caption: "Истинный Экскалибур"
      }
    ]
  },
  {
    title: "Кровавая линия",
    cards: [
      {
        key: "one_of_them",
        title: "Свой среди чужих",
        description: "Восьминогие узнали в тебе своего.",
        frame: "task",
        frameLabel: "Задача",
        condition: "Получить Арахнид",
        icon: "images/other/8572c066ae.png",
        caption: "Арахнид"
      },
      {
        key: "leukemia",
        title: "Лейкемия",
        description: "Сталь запомнила вкус и теперь просит каждый раз.",
        frame: "task",
        frameLabel: "Задача",
        condition: "Создать Убийцу демонов",
        icon: "images/other/8f2915c708.png",
        caption: "Убийца демонов"
      },
      {
        key: "made_in_nether",
        title: "Made in Nether",
        description: "Тридцать блоков, где правишь ты.",
        frame: "goal",
        frameLabel: "Цель",
        condition: "Поднять купол Люцифера",
        icon: "images/other/1f90250f5b.png",
        caption: "Люцифер"
      }
    ]
  },
  {
    title: "Святилища",
    cards: [
      {
        key: "forge_cold",
        title: "Горн остыл",
        description: "Он ковал дольше, чем ты живёшь. Ты оборвал это за один миг.",
        frame: "challenge",
        frameLabel: "Испытание",
        condition: "Победить Горнило",
        icon: "images/icons/forge_heart.png",
        caption: "Сердце кузни"
      },
      {
        key: "dawn_without_angel",
        title: "Рассвет без ангела",
        description: "Он ждал рассвета тысячу лет. Теперь ждать некому.",
        frame: "challenge",
        frameLabel: "Испытание",
        condition: "Победить Серафима",
        icon: "images/icons/seraph_feather.png",
        caption: "Перо серафима"
      },
      {
        key: "roots_let_go",
        title: "Корни разжали хватку",
        description: "Лес держал его так долго, что забыл, зачем.",
        frame: "challenge",
        frameLabel: "Испытание",
        condition: "Победить Древнего стража",
        icon: "images/icons/jungle_heart.png",
        caption: "Сердце джунглей"
      },
      {
        key: "machines_fell_silent",
        title: "Машины замолчали",
        description: "Что-то замолчало, а что-то проснулось.",
        frame: "challenge",
        frameLabel: "Испытание",
        condition: "Победить Предвестника",
        icon: "images/icons/harbinger_core.png",
        caption: "Ядро Предвестника"
      },
      {
        key: "again_and_again",
        title: "Снова и снова",
        description: "Мёртвые возвращаются. Ты тоже. Кто из вас устанет первым?",
        frame: "goal",
        frameLabel: "Цель",
        condition: "Пройти испытание святилища или рейд фабрики",
        icon: "images/guide/minecraft:crossbow.png",
        caption: "Арбалет"
      }
    ]
  },
  {
    title: "Рост клинка и крови",
    cards: [
      {
        key: "one_whole",
        title: "Одно целое",
        description: "Ты больше не держишь клинок. Вы держите друг друга.",
        frame: "goal",
        frameLabel: "Цель",
        condition: "Довести мастерство клинка до 100",
        icon: "images/guide/minecraft:experience_bottle.png",
        caption: "Пузырёк опыта"
      },
      {
        key: "fifth_star",
        title: "Пятая звезда",
        description: "Сталь приняла всё, что ты мог ей дать.",
        frame: "goal",
        frameLabel: "Цель",
        condition: "Заточить клинок до ★5",
        icon: "images/guide/nether_star.png",
        caption: "Звезда Незера"
      },
      {
        key: "eyes_open",
        title: "Пробуждение",
        description: "Он проснулся. Надеюсь, ты не пожалеешь о том, что увидел.",
        frame: "goal",
        frameLabel: "Цель",
        condition: "Пробудить клинок",
        icon: "images/guide/minecraft:ender_eye.png",
        caption: "Око Края"
      },
      {
        key: "blood_remembers",
        title: "Кровь помнит всё",
        description: "Сущность у алтаря, субстанция в руках машины, Серафим у твоих ног — и твоя кровь вспомнила всё.",
        frame: "challenge",
        frameLabel: "Испытание",
        condition: "Поднять кровь до четвёртой формы",
        icon: "images/guide/minecraft:red_dye.png",
        caption: "Красный краситель"
      }
    ]
  },
  {
    title: "Весь путь",
    cards: [
      {
        key: "gaze",
        title: "Взгляд",
        description: "Ещё один скиталец поднял то, что лежало не для него.",
        frame: "task",
        frameLabel: "Задача",
        condition: "Взять в руки любой из особых клинков",
        icon: "images/other/63ca5f7c3f.png",
        caption: "Все-Чёрный"
      },
      {
        key: "distance",
        title: "Расстояние",
        description: "Оно больше ничего не значит.",
        frame: "task",
        frameLabel: "Задача",
        condition: "Первый раз совершить Странствие с Hyperion",
        icon: "images/other/efaf7051a3.png",
        caption: "Hyperion"
      },
      {
        key: "temporary_inconvenience",
        title: "Временное неудобство",
        description: "Десять раз. Для полубога — десять неудобств.",
        frame: "goal",
        frameLabel: "Цель",
        condition: "Умереть 10 раз",
        icon: "images/guide/minecraft:skeleton_skull.png",
        caption: "Череп скелета"
      }
    ]
  }
];
const blood = [
  {
    id: "ember",
    title: "Пепельная кровь",
    colour: "#FF7A2E",
    motto: "Кровь горнов Преисподней. Огонь ей родня, Незер — дом.",
    perks: [
      "Огнестойкость: огонь, лава и магма не ранят.",
      "Ходит по лаве, как по камню, а с Shift ныряет в неё; в Незере бьёт сильнее.",
      "Удар поджигает цель; кто ударит вас, загорится сам.",
      "Смертельный удар не убивает, как тотем: 30 секунд пламени — сопротивление, огненные шары во врагов, Империум бьёт всех, кроме союзников. Раз в 10 минут."
    ],
    formless: false,
    sanctum: "Незеритовая кузня",
    offering: [],
    deed: "",
    weapons: [
      {
        id: "lucifer",
        name: "Люцифер",
        icon: "images/other/1f90250f5b.png",
        form: 4
      },
      {
        id: "demon_will",
        name: "Воля Демона",
        icon: "images/other/5ffe2fbc10.png",
        form: 2
      },
      {
        id: "demon_slayer",
        name: "Убийца демонов",
        icon: "images/other/8f2915c708.png",
        form: 1
      },
      {
        id: "grave_splitter",
        name: "Сборщик душ",
        icon: "images/other/ca0b2d0595.png",
        form: 2
      },
      {
        id: "berserker_axe",
        name: "Секира берсерка",
        icon: "images/other/66344d5ef9.png",
        form: 1
      }
    ]
  },
  {
    id: "sky",
    title: "Небесная кровь",
    colour: "#A8E2FF",
    motto: "Кровь тех, кто первым поднялся к облакам. Земля ей тесна.",
    perks: [
      "Падения ранят вдвое слабее.",
      "Двойной прыжок: ещё раз в воздухе, падение после него не ранит.",
      "Голубые крылья: прыжок в воздухе и удержание — полёт. Заряд крыльев восстанавливается на земле."
    ],
    formless: false,
    sanctum: "Небесный храм",
    offering: [],
    deed: "",
    weapons: [
      {
        id: "hyperion",
        name: "Hyperion",
        icon: "images/other/efaf7051a3.png",
        form: 3
      },
      {
        id: "solstice",
        name: "Солнцестояние",
        icon: "images/other/1a4474ed65.png",
        form: 2
      },
      {
        id: "excalibur",
        name: "Экскалибур",
        icon: "images/other/a911f57db9.png",
        form: 2
      },
      {
        id: "phoenix_axe",
        name: "Золотой феникс",
        icon: "images/other/c02c9c9337.png",
        form: 1
      },
      {
        id: "phantomguard",
        name: "Призрачный страж",
        icon: "images/other/28b6759ee6.png",
        form: 2
      }
    ]
  },
  {
    id: "night",
    title: "Ночная небесная кровь",
    colour: "#5C7CFF",
    motto: "Небо, отданное ночи. Звёзды ей ближе солнца.",
    perks: [
      "Падения ранят вдвое слабее.",
      "Двойной прыжок: ещё раз в воздухе, падение после него не ранит.",
      "Синие крылья, как у небесной крови; ночью под открытым небом — ночное зрение.",
      "Смертельный удар не убивает: 30 с полёта без счёта, регенерация и три падших серафима. Раз в 10 минут."
    ],
    formless: false,
    sanctum: "Тёмный храм",
    offering: [],
    deed: "",
    weapons: [
      {
        id: "true_excalibur",
        name: "Истинный Экскалибур",
        icon: "images/other/e470fbf77d.png",
        form: 4
      },
      {
        id: "stars_edge",
        name: "Звёздная грань",
        icon: "images/other/eadcf5b768.png",
        form: 1
      },
      {
        id: "requiem",
        name: "Реквием девятого неба",
        icon: "images/other/f8ef121ebd.png",
        form: 1
      },
      {
        id: "nocturne",
        name: "Ночная фурия",
        icon: "images/other/6d22f8cf26.png",
        form: 1
      }
    ]
  },
  {
    id: "abyss",
    title: "Кровь бездны",
    colour: "#7A4AD0",
    motto: "Кровь, что видит в темноте. Ночь ей мать, тень — укрытие.",
    perks: [
      "Зажмите ПКМ с мечом, топором или Все-Чёрным: на 10 секунд вы — тень, невидимая и неуязвимая, а враги рядом иссыхают.",
      "Смертельный удар не убивает, а все, кого коснулась бездна Все-Чёрного, становятся её жертвами: бездна терзает их и взрывает. Раз в 10 минут."
    ],
    formless: true,
    sanctum: "Незеритовая кузня",
    offering: [
      "48 осколков души",
      "Душа демона ×2",
      "Душа Иссушителя",
      "32 скалка"
    ],
    deed: "вырвать у Хранителя сердце",
    weapons: [
      {
        id: "all_black",
        name: "Все-Чёрный",
        icon: "images/other/63ca5f7c3f.png",
        form: 1
      }
    ]
  },
  {
    id: "steel",
    title: "Кровь предков",
    colour: "#C9CFD6",
    motto: "Кровь тех, кто стоял в строю до последнего. Её не сдвинуть.",
    perks: [
      "Не отбрасывается; яд и иссушение не действуют.",
      "+6 к броне; полсердца каждые 10 секунд.",
      "Двойной прыжок без урона от падения; удар в прыжке стягивает врагов к цели.",
      "Ниже половины здоровья — щит на 20 ударов, раз в 10 минут."
    ],
    formless: false,
    sanctum: "Храм джунглей",
    offering: [],
    deed: "",
    weapons: [
      {
        id: "celestial",
        name: "Селестиал",
        icon: "images/other/97fc9f3d00.png",
        form: 4
      },
      {
        id: "enigma",
        name: "Энигма",
        icon: "images/other/fd4a3c08f5.png",
        form: 3
      },
      {
        id: "terra_cutter",
        name: "Терра-резак",
        icon: "images/other/2808503131.png",
        form: 1
      },
      {
        id: "terra_blade",
        name: "Терра-блейд",
        icon: "images/other/bb4efe2f62.png",
        form: 2
      },
      {
        id: "ancient",
        name: "Древний",
        icon: "images/icons/ancient.png",
        form: 2
      }
    ]
  },
  {
    id: "techno",
    title: "Техноорганическая кровь",
    colour: "#3FD9C0",
    motto: "В ней течёт ток. Металл ей родня.",
    perks: [
      "Яд не действует; падение ранит вдвое слабее.",
      "+2 урона в ближнем бою и +4 брони.",
      "Удар показывает здоровье цели; реактивные сапоги на 2,5 с.",
      "Режим убийцы ниже половины здоровья: скорость III, таран с взрывом."
    ],
    formless: false,
    sanctum: "Древняя фабрика",
    offering: [
      "48 древних деталей",
      "Ядро Предвестника",
      "16 медных блоков",
      "8 блоков редстоуна"
    ],
    deed: "уничтожить 100 автоматонов фабрики",
    weapons: [
      {
        id: "creation_splitter",
        name: "Антихрист",
        icon: "images/other/e48e7744f6.png",
        form: 4
      },
      {
        id: "cyber_katana",
        name: "Энцефало-клинок",
        icon: "images/other/9e6ab2b7b7.png",
        form: 2
      },
      {
        id: "cyber_blade",
        name: "Энцефало-меч",
        icon: "images/other/431234757a.png",
        form: 1
      }
    ]
  }
];
const mastery = [
  {
    level: 10,
    total: "475",
    bonus: "+1%",
    note: ""
  },
  {
    level: 15,
    total: "900",
    bonus: "+1.5%",
    note: "можно ★1"
  },
  {
    level: 30,
    total: "2 925",
    bonus: "+3%",
    note: "★2"
  },
  {
    level: 45,
    total: "6 075",
    bonus: "+4.5%",
    note: "★3"
  },
  {
    level: 50,
    total: "7 375",
    bonus: "+5%",
    note: "пробуждение клинка"
  },
  {
    level: 60,
    total: "10 350",
    bonus: "+6%",
    note: "★4"
  },
  {
    level: 75,
    total: "15 750",
    bonus: "+7.5%",
    note: "★5"
  },
  {
    level: 100,
    total: "27 250",
    bonus: "+10%",
    note: "предел"
  }
];
const recipes = [
  {
    result: "terra_ingot",
    grid: [
      "v:emerald_block",
      "v:emerald_block",
      "v:emerald_block",
      "v:emerald_block",
      "v:diamond",
      "v:emerald_block",
      "v:emerald_block",
      "v:emerald_block",
      "v:emerald_block"
    ]
  },
  {
    result: "demonic_cutter",
    grid: [
      "cutter",
      "demon_soul",
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    shapeless: true
  },
  {
    result: "demon_slayer",
    grid: [
      "arachnid",
      "demon_soul",
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    shapeless: true
  },
  {
    result: "terra_cutter",
    grid: [
      "terra_ingot",
      "terra_ingot",
      "terra_ingot",
      "terra_ingot",
      "demonic_cutter",
      "terra_ingot",
      "terra_ingot",
      "terra_ingot",
      "terra_ingot"
    ]
  },
  {
    result: "wanderer_cube",
    grid: [
      "v:crying_obsidian",
      "v:crying_obsidian",
      "v:crying_obsidian",
      "terra_essence",
      "v:nether_star",
      "hell_essence",
      "v:crying_obsidian",
      "v:crying_obsidian",
      "v:crying_obsidian"
    ],
    note: "Сущности можно поменять местами."
  },
  {
    result: "g:air_compass",
    grid: [
      null,
      "v:wind_charge",
      null,
      "v:wind_charge",
      "v:compass",
      "v:wind_charge",
      null,
      "v:wind_charge",
      null
    ]
  },
  {
    result: "g:forge_map",
    grid: [
      null,
      "v:nether_brick",
      null,
      "v:nether_brick",
      "v:map",
      "v:nether_brick",
      null,
      "v:nether_brick",
      null
    ]
  },
  {
    result: "g:jungle_map",
    grid: [
      null,
      "v:emerald",
      null,
      "v:emerald",
      "v:map",
      "v:emerald",
      null,
      "v:emerald",
      null
    ]
  },
  {
    result: "g:night_compass",
    grid: [
      "g:air_compass",
      "v:nether_star",
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    shapeless: true
  }
];
const vanillaNames = {
  emerald_block: "Изумрудный блок",
  diamond: "Алмаз",
  crying_obsidian: "Плачущий обсидиан",
  nether_star: "Звезда Незера",
  compass: "Компас",
  wind_charge: "Заряд ветра",
  map: "Пустая карта",
  nether_brick: "Незерский кирпич",
  emerald: "Изумруд",
  lapis_block: "Лазуритовый блок",
  diamond_block: "Алмазный блок",
  gold_block: "Золотой блок",
  copper_block: "Медный блок",
  iron_block: "Железный блок",
  redstone_block: "Блок редстоуна",
  ender_pearl: "Жемчуг Края",
  netherite_ingot: "Незеритовый слиток",
  amethyst_shard: "Осколок аметиста",
  paper: "Бумага",
  light_blue_dye: "Голубой краситель",
  black_dye: "Чёрный краситель",
  quartz: "Кварц",
  totem_of_undying: "Тотем бессмертия",
  phantom_membrane: "Мембрана фантома"
};
const guideNames = {
  air_compass: "Компас воздуха",
  forge_map: "Карта кузни",
  jungle_map: "Карта джунглей",
  night_compass: "Ночной компас"
};
const data = {
  counts,
  words,
  icons,
  guideIcons,
  images,
  rarities,
  items,
  altar,
  chains,
  hotbar,
  achievements,
  blood,
  mastery,
  recipes,
  vanillaNames,
  guideNames
};
export {
  data as d
};
