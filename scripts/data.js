const counts = {
  weapons: 30,
  materials: 22,
  trophies: 37
};
const words = {
  weapons: "клинков",
  materials: "материала",
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
  wanderer_cube_gray: "images/icons/wanderer_cube_gray.png"
};
const guideIcons = {
  diamond: "images/guide/diamond.png",
  emerald_block: "images/guide/emerald_block.png",
  crying_obsidian: "images/guide/crying_obsidian.png",
  air_compass: "images/guide/air_compass.png",
  forge_map: "images/guide/forge_map.png",
  jungle_map: "images/guide/jungle_map.png",
  wind_charge: "images/guide/wind_charge.png",
  nether_brick: "images/guide/nether_brick.png",
  emerald: "images/guide/emerald.png",
  compass: "images/guide/compass.png",
  map: "images/guide/map.png",
  nether_star: "images/guide/nether_star.png",
  night_compass: "images/guide/night_compass.png",
  unknown_compass: "images/guide/unknown_compass.png"
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
      "Рассекатель могил",
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
      "Королевские часы"
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
      "Терра-компас"
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
      "Перо серафима"
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
      "Энцефало-истребитель",
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
    stats: "Урон 7 · Скорость 1.6",
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
      '<span style="color:#555555"><em>В сталь вплавили то, что моргало. Теперь моргает сталь.</em></span>',
      "",
      '<span style="color:#FFAA00">✦ Пекло</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">правый клик</span>',
      '<span style="color:#AAAAAA">На минуту — скорость, сила и огнестойкость.</span>',
      '<span style="color:#AAAAAA">Из вас хлещет пламя, и это видно всем.</span>',
      '<span style="color:#555555">Перезарядка 5 минут с конца действия.</span>'
    ],
    stats: "Урон 9 · Скорость 1.6",
    icon: "images/other/a4a3c2e4f9.png",
    obtain: "Крафт: Погибель + Душа демона",
    method: "craft",
    methodLabel: "Верстак",
    recipe: true
  },
  {
    kind: "weapon",
    id: "demon_will",
    name: "Воля Демона",
    rarity: "HELLISH",
    rarityLabel: "Адская",
    line: "hell",
    lore: [
      '<span style="color:#555555"><em>Иссушитель умер. То, что внутри клинка, — нет.</em></span>',
      "",
      '<span style="color:#FFAA00">✦ Пекло</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">правый клик</span>',
      '<span style="color:#AAAAAA">Минута скорости, силы и огнестойкости —</span>',
      '<span style="color:#AAAAAA">и всё живое в 35 блоках вспыхивает на 10 секунд.</span>',
      "",
      '<span style="color:#FF5555">✦ Прозрение</span>',
      '<span style="color:#AAAAAA">Удар по подсвеченному проходит сквозь треть его брони.</span>',
      '<span style="color:#AAAAAA">Убийство подсвеченного даёт регенерацию II на 5 секунд.</span>'
    ],
    stats: "Урон 11 · Скорость 1.6",
    icon: "images/other/5ffe2fbc10.png",
    obtain: "Крафт из Бедствия или эволюция в Незеритовой кузне",
    method: "craft",
    methodLabel: "Верстак",
    recipe: true
  },
  {
    kind: "weapon",
    id: "all_black",
    name: "Все-Чёрный",
    rarity: "ULTRA_HELLISH",
    rarityLabel: "Ультра-адская",
    line: "abyss",
    lore: [
      '<span style="color:#555555"><em>Тот, кто использует его для наблюдения за вами</em></span>',
      '<span style="color:#555555"><em>и окружающим миром, кажется не в состоянии физически</em></span>',
      '<span style="color:#555555"><em>добраться до вас, или не желает этого делать.</em></span>',
      '<span style="color:#555555"><em>Независимо от того, способен ли он на это или просто</em></span>',
      '<span style="color:#555555"><em>не желает устанавливать какой-либо контакт за пределами</em></span>',
      '<span style="color:#555555"><em>ментального, это остаётся загадкой.</em></span>',
      "",
      '<span style="color:#AAAAAA"><em>Чтобы презирать богов, надо их знать.</em></span>',
      "",
      '<span style="color:#AA0000">✦ Ужас</span>',
      '<span style="color:#AAAAAA">Мирные и стрелки идут к вам вплотную,</span>',
      '<span style="color:#AAAAAA">бойцы ближнего боя отлетают в чёрном дыму.</span>',
      "",
      '<span style="color:#AA0000">✦ Жертва</span>',
      '<span style="color:#AAAAAA">Первый, кого вы ударите, становится жертвой.</span>',
      '<span style="color:#AAAAAA">От руки жертвы вы не умрёте: смертельный удар,</span>',
      '<span style="color:#AAAAAA">стрела, зелье или падение после её удара</span>',
      '<span style="color:#AAAAAA">просто не случатся. Других это не касается.</span>',
      '<span style="color:#AAAAAA">Жертва одна; её отпускает смерть или 30 секунд</span>',
      '<span style="color:#AAAAAA">без ваших ударов — тогда можно выбрать новую.</span>',
      "",
      '<span style="color:#AA0000">✦ Тёмная территория</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">правый клик</span>',
      '<span style="color:#AAAAAA">Тёмный купол радиусом 12 блоков на 30 секунд.</span>',
      '<span style="color:#AAAAAA">В нём сами собой раскрываются чёрные разрезы:</span>',
      '<span style="color:#AAAAAA">все, кроме своих, получают 4 урона в секунду.</span>',
      '<span style="color:#AAAAAA">Пока вы внутри, вас нельзя убить.</span>',
      '<span style="color:#555555">Перезарядка 5 минут.</span>'
    ],
    stats: "Урон 14 · Скорость 1.6",
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
      '<span style="color:#555555"><em>Корона пекла, выкованная из его же сердца.</em></span>',
      "",
      '<span style="color:#FFAA00">✦ Дыхание пекла</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">держать правую кнопку</span>',
      '<span style="color:#AAAAAA">Огонь на 8 блоков вперёд, как дыхание дракона:</span>',
      '<span style="color:#AAAAAA">4 урона и поджог каждому врагу в нём. Без перезарядки.</span>',
      "",
      '<span style="color:#FFAA00">✦ Горнило</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">правый клик</span>',
      '<span style="color:#AAAAAA">Призывает кузнеца Преисподней на минуту:</span>',
      '<span style="color:#AAAAAA">он бьётся за вас, но здоровья у него куда меньше.</span>',
      '<span style="color:#555555">Перезарядка 5 минут.</span>',
      "",
      '<span style="color:#FFAA00">✦ Дом</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">пассивно</span>',
      '<span style="color:#AAAAAA">В Незере удары и способности — вдвое сильнее.</span>'
    ],
    stats: "Урон 14 · Скорость 1.6",
    icon: "images/other/f29e190984.png",
    obtain: "Ковка в Незеритовой кузне: Воля Демона, Сердце кузни, 64 осколка души",
    method: "forge",
    methodLabel: "Ковка у алтаря",
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
      '<span style="color:#555555"><em>Кто-то унёс его под землю и не вернулся.</em></span>',
      "",
      '<span style="color:#AAAAAA">✦ Разделка</span>',
      '<span style="color:#AAAAAA">Удар достаёт врагов в области 3×3×3 вокруг цели.</span>'
    ],
    stats: "Урон 5 · Скорость 1",
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
      '<span style="color:#555555"><em>Лезвие потемнело и стало брать шире.</em></span>',
      "",
      '<span style="color:#FF55FF">✦ Разделка</span>',
      '<span style="color:#AAAAAA">Удар достаёт врагов в области 4×4×4 вокруг цели.</span>'
    ],
    stats: "Урон 7 · Скорость 1",
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
      '<span style="color:#555555"><em>Зелёный металл не тупится и не прощает.</em></span>',
      "",
      '<span style="color:#55FF55">✦ Разделка</span>',
      '<span style="color:#AAAAAA">Удар достаёт врагов в области 5×5×5 вокруг цели.</span>',
      "",
      '<span style="color:#55FF55">✦ Жила</span>',
      '<span style="color:#AAAAAA">С каждого убитого падает изумруд. Шанс — треть.</span>'
    ],
    stats: "Урон 10 · Скорость 1",
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
      '<span style="color:#555555"><em>Тот, кто его ковал, держал пауков не для яда.</em></span>',
      "",
      '<span style="color:#AA00AA">✦ Свой среди чужих</span>',
      '<span style="color:#AAAAAA">По паукам бьёт вдвое сильнее.</span>',
      "",
      '<span style="color:#FF55FF">✦ Свора</span>',
      '<span style="color:#AAAAAA">Удар зовёт паука на ту же цель. Он ваш и вас не тронет,</span>',
      '<span style="color:#AAAAAA">но уходит, простояв без дела полминуты.</span>'
    ],
    stats: "Урон 8 · Скорость 1.6",
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
      '<span style="color:#555555"><em>Паучья сталь напилась и больше не отпускает.</em></span>',
      "",
      '<span style="color:#FF5555">✦ Жажда</span>',
      '<span style="color:#AAAAAA">Удар с шансом в треть возвращает вам половину</span>',
      '<span style="color:#AAAAAA">того, что вы нанесли.</span>',
      "",
      '<span style="color:#FF5555">✦ Добыча</span>',
      '<span style="color:#AAAAAA">Убийство возвращает пятую часть здоровья цели —</span>',
      '<span style="color:#AAAAAA">чем крупнее добыча, тем больше достаётся вам.</span>'
    ],
    stats: "Урон 10 · Скорость 1.6",
    icon: "images/other/8f2915c708.png",
    obtain: "Крафт: Арахнид + Душа демона",
    method: "craft",
    methodLabel: "Верстак",
    recipe: true
  },
  {
    kind: "weapon",
    id: "grave_splitter",
    name: "Рассекатель могил",
    rarity: "HELLISH",
    rarityLabel: "Адская",
    line: "blood",
    lore: [
      '<span style="color:#555555"><em>Пять тысяч раз он пил. На пять тысяч первый</em></span>',
      '<span style="color:#555555"><em>научился поднимать тех, кого выпил.</em></span>',
      "",
      '<span style="color:#FF5555">✦ Жажда</span>',
      '<span style="color:#AAAAAA">Удар с шансом в треть возвращает вам половину</span>',
      '<span style="color:#AAAAAA">того, что вы нанесли.</span>',
      "",
      '<span style="color:#FF5555">✦ Добыча</span>',
      '<span style="color:#AAAAAA">Убийство возвращает пятую часть здоровья цели.</span>',
      "",
      '<span style="color:#FF5555">✦ Свита могил</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">правый клик</span>',
      '<span style="color:#AAAAAA">Рядом встают три скелета-иссушителя и бьются</span>',
      '<span style="color:#AAAAAA">за вас: по вашей цели, по тому, кто ударил вас,</span>',
      '<span style="color:#AAAAAA">иначе по ближайшему врагу.</span>',
      '<span style="color:#555555">Стоят 30 секунд. Перезарядка 60 секунд.</span>'
    ],
    stats: "Урон 11 · Скорость 1.6",
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
      '<span style="color:#555555"><em>Самый яркий из них упал первым.</em></span>',
      '<span style="color:#555555"><em>С тех пор его свет греет только своих.</em></span>',
      "",
      '<span style="color:#FF5555">✦ Дары незера</span>',
      '<span style="color:#AAAAAA">Каждого, кого вы ударили, с вами связывает</span>',
      '<span style="color:#AAAAAA">красный луч — до 10 целей, до 20 блоков.</span>',
      '<span style="color:#AAAAAA">Связанные теряют 2 здоровья в секунду,</span>',
      '<span style="color:#AAAAAA">и всё отнятое лучами лечит вас.</span>',
      '<span style="color:#AAAAAA">Отойдут дальше — луч рвётся.</span>',
      "",
      '<span style="color:#FFAA00">✦ Сделка с дьяволом</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">правый клик</span>',
      '<span style="color:#AAAAAA">Поднимает купол радиусом 30 блоков на 30 секунд.</span>',
      '<span style="color:#AAAAAA">Свои под ним исцеляются, бьют сильнее и держат удар.</span>',
      '<span style="color:#AAAAAA">Чужие под ним горят и не могут залечить ран,</span>',
      '<span style="color:#AAAAAA">а всё, что отнял у них огонь, лечит вас.</span>',
      '<span style="color:#555555">Перезарядка 90 секунд.</span>'
    ],
    stats: "Урон 14 · Скорость 1.6",
    icon: "images/other/1f90250f5b.png",
    obtain: "Эволюция Рассекателя могил в Незеритовой кузне",
    method: "evolve",
    methodLabel: "Эволюция у алтаря",
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
      '<span style="color:#555555"><em>Она и не ждёт его.</em></span>',
      "",
      '<span style="color:#AAAAAA">✦ Тяжесть</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">пассивно</span>',
      '<span style="color:#AAAAAA">Критический удар в прыжке замедляет цель</span>',
      '<span style="color:#AAAAAA">на 2 секунды.</span>',
      "",
      '<span style="color:#AA00AA">✦ Иной облик</span>',
      '<span style="color:#AAAAAA">Будь при вас, когда падёт страж святилища:</span>',
      '<span style="color:#AAAAAA">Горнило — и она станет Секирой берсерка,</span>',
      '<span style="color:#AAAAAA">Серафим — и она станет Золотым фениксом.</span>'
    ],
    stats: "Урон 10 · Скорость 1",
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
      '<span style="color:#555555"><em>и каждая рана делает её тяжелее.</em></span>',
      "",
      '<span style="color:#FF5555">✦ Ярость</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">пассивно</span>',
      '<span style="color:#AAAAAA">+5% урона за каждое потерянное сердце, до +50%.</span>',
      "",
      '<span style="color:#FF5555">✦ Боевой клич</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">правый клик</span>',
      '<span style="color:#AAAAAA">10 секунд силы II, скорости и стойкости</span>',
      '<span style="color:#AAAAAA">к отбрасыванию. Пока клич звучит, раны не заживают.</span>',
      '<span style="color:#AAAAAA">Волна рёва отбрасывает врагов в 5 блоках и замедляет.</span>',
      '<span style="color:#555555">Перезарядка 60 секунд.</span>'
    ],
    stats: "Урон 13 · Скорость 1",
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
      '<span style="color:#555555"><em>Сумрачная сталь впервые увидела рассвет.</em></span>',
      "",
      '<span style="color:#FFAA00">✦ Из пепла</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">пассивно</span>',
      '<span style="color:#AAAAAA">Раз в 10 минут смертельный удар не убивает:</span>',
      '<span style="color:#AAAAAA">4 сердца, огнестойкость и пламя вокруг.</span>',
      "",
      '<span style="color:#FFAA00">✦ Крыло</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">правый клик</span>',
      '<span style="color:#AAAAAA">Огненная дуга на 8 блоков перед собой —</span>',
      '<span style="color:#AAAAAA">союзников не задевает.</span>',
      '<span style="color:#555555">Перезарядка 15 секунд.</span>'
    ],
    stats: "Урон 14 · Скорость 1",
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
      '<span style="color:#555555"><em>Для кого-то — последний.</em></span>',
      "",
      '<span style="color:#FFFF55">✦ Зенит</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">пассивно</span>',
      '<span style="color:#AAAAAA">Днём +2 урона.</span>',
      "",
      '<span style="color:#FFFF55">✦ Полдень</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">удерживать правый клик</span>',
      '<span style="color:#AAAAAA">Пока кнопка зажата, клинок вспыхивает каждую</span>',
      '<span style="color:#AAAAAA">секунду: 2 урона всему враждебному в 12 блоках,</span>',
      '<span style="color:#AAAAAA">нежить загорается.</span>',
      '<span style="color:#555555">Без перезарядки.</span>'
    ],
    stats: "Урон 13 · Скорость 1.6",
    icon: "images/other/1a4474ed65.png",
    obtain: "Ковка в Небесном храме, днём",
    method: "forge",
    methodLabel: "Ковка у алтаря",
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
      '<span style="color:#5555FF">✦ Полночь</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">пассивно</span>',
      '<span style="color:#AAAAAA">Ночью +2 урона. В руке — ночное зрение.</span>',
      "",
      '<span style="color:#5555FF">✦ Ночной разрез</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">правый клик</span>',
      '<span style="color:#AAAAAA">Синий серп летит на 10 блоков вперёд и</span>',
      '<span style="color:#AAAAAA">пронзает врагов на пути: 10 урона каждому.</span>',
      '<span style="color:#555555">Перезарядка 3 секунды.</span>',
      "",
      '<span style="color:#555555">Солнцестояние в одной руке и Ночная фурия в другой</span>',
      '<span style="color:#555555">не знают ни дня, ни ночи.</span>'
    ],
    stats: "Урон 13 · Скорость 1.6",
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
      '<span style="color:#555555"><em>что именно охраняет. Тебя — пока что.</em></span>',
      "",
      '<span style="color:#55FFFF">✦ Бесплотность</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">пассивно</span>',
      '<span style="color:#AAAAAA">Каждый четвёртый удар проходит насквозь.</span>',
      '<span style="color:#AAAAAA">Фантомы не трогают владельца.</span>',
      "",
      '<span style="color:#55FFFF">✦ Призрачная стая</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">правый клик</span>',
      '<span style="color:#AAAAAA">Пять фантомов кружат вокруг вас, и круг</span>',
      '<span style="color:#AAAAAA">всё шире. Задетый враг получает 6 урона.</span>',
      '<span style="color:#555555">Стая держится 5 секунд. Перезарядка 12 секунд.</span>'
    ],
    stats: "Урон 12 · Скорость 1.6",
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
      '<span style="color:#555555"><em>в ночь, когда луна полна.</em></span>',
      "",
      '<span style="color:#5555FF">✦ Созвездие</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">пассивно</span>',
      '<span style="color:#AAAAAA">Каждый удар зажигает над целью звезду.</span>',
      '<span style="color:#AAAAAA">Пятая складывает созвездие: +8 урона и слепота.</span>',
      "",
      '<span style="color:#5555FF">✦ Звездопад</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">правый клик</span>',
      '<span style="color:#AAAAAA">Туда, куда вы смотрите, падают 5 звёзд:</span>',
      '<span style="color:#AAAAAA">каждая — 4,5 урона в 2 блоках и подброс.</span>',
      '<span style="color:#AAAAAA">Ночью звёзд вдвое больше. Раз в секунду.</span>'
    ],
    stats: "Урон 13 · Скорость 1.6",
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
      '<span style="color:#555555"><em>и вернулась оттуда косой.</em></span>',
      "",
      '<span style="color:#5555FF">✦ Ночная песнь</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">пассивно</span>',
      '<span style="color:#AAAAAA">Ночью +2 урона.</span>',
      "",
      '<span style="color:#5555FF">✦ Синяя туча</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">правый клик</span>',
      '<span style="color:#AAAAAA">На 10 секунд вы становитесь синей тучей:</span>',
      '<span style="color:#AAAAAA">летаете, не получаете физического урона</span>',
      '<span style="color:#AAAAAA">и бьёте на 4 каждого врага, сквозь</span>',
      '<span style="color:#AAAAAA">которого пролетели.</span>',
      '<span style="color:#555555">Перезарядка 20 секунд.</span>'
    ],
    stats: "Урон 15 · Скорость 1.2",
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
      '<span style="color:#555555"><em>а ножны — и в них спало ещё что-то.</em></span>',
      "",
      '<span style="color:#FFAA00">✦ Благословение</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">пассивно</span>',
      '<span style="color:#AAAAAA">По нежити +2 урона.</span>',
      "",
      '<span style="color:#FFAA00">✦ Клятва рыцаря</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">правый клик</span>',
      '<span style="color:#AAAAAA">8 секунд силы I и сопротивления I.</span>',
      '<span style="color:#555555">Перезарядка 30 секунд.</span>'
    ],
    stats: "Урон 12 · Скорость 1.6",
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
      '<span style="color:#555555"><em>что в них спало, пока не пришёл достойный.</em></span>',
      "",
      '<span style="color:#FFAA00">✦ Свет святого</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">пассивно</span>',
      '<span style="color:#AAAAAA">Каждый удар лечит вас на полсердца,</span>',
      '<span style="color:#AAAAAA">по нежити — ещё +3 урона.</span>',
      "",
      '<span style="color:#FFAA00">✦ Ножны</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">пассивно</span>',
      '<span style="color:#AAAAAA">Пока клинок в руке — сопротивление I.</span>',
      "",
      '<span style="color:#FFAA00">✦ Королевский суд</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">правый клик</span>',
      '<span style="color:#AAAAAA">Золотая волна на 16 блоков вперёд: 14 урона</span>',
      '<span style="color:#AAAAAA">врагам на пути, нежить вспыхивает. Вам — сила II</span>',
      '<span style="color:#AAAAAA">на 5 секунд.</span>',
      '<span style="color:#555555">Перезарядка 1 секунда.</span>'
    ],
    stats: "Урон 16 · Скорость 1.6",
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
      '<span style="color:#555555"><em>и всего, что в нём когда-то умерло.</em></span>',
      "",
      '<span style="color:#55FF55">✦ Терра-лучи</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">удерживать правый клик</span>',
      '<span style="color:#AAAAAA">Пока кнопка зажата, клинок строчит зелёными лучами:</span>',
      '<span style="color:#AAAAAA">1 урон и отравление первому, кого луч заденет.</span>',
      '<span style="color:#555555">Десять лучей в секунду, до 24 блоков.</span>',
      '<span style="color:#555555">Союзников лучи проходят насквозь.</span>',
      "",
      '<span style="color:#55FF55">✦ Щит жизни</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">пассивно</span>',
      '<span style="color:#AAAAAA">Пока клинок в руке, вас окружает зелёный щит:</span>',
      '<span style="color:#AAAAAA">любое исцеление вдвое сильнее.</span>'
    ],
    stats: "Урон 12 · Скорость 1.6",
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
      '<span style="color:#555555"><em>и камень помнит каждый его удар.</em></span>',
      "",
      '<span style="color:#55FF55">✦ Гнев предков</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">пассивно</span>',
      '<span style="color:#AAAAAA">По разбойникам и ведьмам +4 урона.</span>',
      '<span style="color:#AAAAAA">Каждый удар оплетает цель корнями:</span>',
      '<span style="color:#AAAAAA">замедление II на 1,5 секунды.</span>',
      "",
      '<span style="color:#55FF55">✦ Разлом</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">правый клик</span>',
      '<span style="color:#AAAAAA">Удар оземь: разлом бежит на 6 блоков вокруг —</span>',
      '<span style="color:#AAAAAA">8 урона, подброс и корни на 3 секунды.</span>',
      '<span style="color:#AAAAAA">Вам — поглощение II на 8 секунд.</span>',
      '<span style="color:#555555">Перезарядка 20 секунд.</span>'
    ],
    stats: "Урон 11 · Скорость 1.6",
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
      '<span style="color:#555555"><em>и того, кто сможет его вынести.</em></span>',
      "",
      '<span style="color:#55FF55">✦ Круг предков</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">правый клик</span>',
      '<span style="color:#AAAAAA">У ваших ног пульсирует круг от 3 до 8 блоков.</span>',
      '<span style="color:#AAAAAA">Свои в нём получают регенерацию III и сопротивление,</span>',
      '<span style="color:#AAAAAA">вы — ещё и скорость. Враги в нём — отравление III.</span>',
      '<span style="color:#555555">Держится 10 секунд. Перезарядка 30 секунд.</span>',
      "",
      '<span style="color:#FFAA00">✦ Печать загадки</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">пассивно</span>',
      '<span style="color:#AAAAAA">Третий удар подряд по одной цели ломает печать:</span>',
      '<span style="color:#AAAAAA">+6 урона и слабость на 5 секунд.</span>',
      "",
      '<span style="color:#FFAA00">✦ Завет предков</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">пассивно</span>',
      '<span style="color:#AAAAAA">Когда здоровья меньше трети, предки заслоняют вас:</span>',
      '<span style="color:#AAAAAA">поглощение II на 10 секунд, а союзникам рядом —</span>',
      '<span style="color:#AAAAAA">сопротивление. Раз в минуту.</span>'
    ],
    stats: "Урон 13 · Скорость 1.6",
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
      '<span style="color:#555555"><em>Вопрос, на который предки наконец ответили.</em></span>',
      "",
      '<span style="color:#55FF55">✦ Благодать</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">пассивно</span>',
      '<span style="color:#AAAAAA">Любое исцеление в 2,5 раза сильнее.</span>',
      "",
      '<span style="color:#55FF55">✦ Метка неба</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">при ударе</span>',
      '<span style="color:#AAAAAA">Цель светится зелёным 10 секунд: не исцеляется,</span>',
      '<span style="color:#AAAAAA">получает в 1,5 раза больше урона, а ваш урон</span>',
      '<span style="color:#AAAAAA">по ней возвращается вам здоровьем (четверть).</span>',
      "",
      '<span style="color:#55FF55">✦ Спираль</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">правый клик</span>',
      '<span style="color:#AAAAAA">Поле радиусом 15 блоков на 15 секунд, идёт за вами.</span>',
      '<span style="color:#AAAAAA">Враги в нём отравлены и подброшены на 6 блоков —</span>',
      '<span style="color:#AAAAAA">и снова, едва упадут, пока не выйдут.</span>',
      '<span style="color:#AAAAAA">Свои — регенерация, вы — сопротивление II.</span>',
      '<span style="color:#555555">Перезарядка 90 секунд.</span>'
    ],
    stats: "Урон 15 · Скорость 1.6",
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
      '<span style="color:#555555"><em>каждому, кто впустил её в кровь.</em></span>',
      "",
      '<span style="color:#FF5555">✦ Проводник</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">пассивно</span>',
      '<span style="color:#AAAAAA">Каждый пятый удар бьёт молнией ещё двух</span>',
      '<span style="color:#AAAAAA">ближайших врагов в 5 блоках: по 4 урона.</span>',
      "",
      '<span style="color:#FF5555">✦ Медный голем</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">правый клик</span>',
      '<span style="color:#AAAAAA">Голем на 60 секунд бьёт тех, кого бьёте вы.</span>',
      '<span style="color:#555555">Снова — через 30 секунд после его гибели.</span>',
      "",
      '<span style="color:#FF5555">✦ Отталкивающий луч</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">удерживать правый клик</span>',
      '<span style="color:#AAAAAA">Луч до самой стены: 0,5 урона и сильный отброс</span>',
      '<span style="color:#AAAAAA">всех на пути; кто в нём остался, того несёт дальше.</span>',
      '<span style="color:#555555">Без перезарядки.</span>'
    ],
    stats: "Урон 10 · Скорость 1.6",
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
      '<span style="color:#555555"><em>и в нём уже почти нет ошибок.</em></span>',
      "",
      '<span style="color:#FF5555">✦ Проводник</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">пассивно</span>',
      '<span style="color:#AAAAAA">Каждый четвёртый удар бьёт молнией ещё трёх</span>',
      '<span style="color:#AAAAAA">ближайших врагов в 5 блоках: по 5 урона.</span>',
      "",
      '<span style="color:#FF5555">✦ Медные големы</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">правый клик</span>',
      '<span style="color:#AAAAAA">Три голема на 60 секунд бьют тех, кого бьёте вы.</span>',
      '<span style="color:#555555">Снова — через 30 секунд после гибели последнего.</span>',
      "",
      '<span style="color:#FF5555">✦ Лазеры</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">удерживать правый клик</span>',
      '<span style="color:#AAAAAA">Поток лазеров, по 1 урона. Без перезарядки.</span>'
    ],
    stats: "Урон 12 · Скорость 1.6",
    icon: "images/other/9e6ab2b7b7.png",
    obtain: "Сам вырастает из Энцефало-меча",
    method: "grows",
    methodLabel: "Растёт сам",
    recipe: false
  },
  {
    kind: "weapon",
    id: "creation_splitter",
    name: "Энцефало-истребитель",
    rarity: "TECHNO",
    rarityLabel: "Техно",
    line: "techno",
    lore: [
      '<span style="color:#555555"><em>На нём нет нитей. Его ковали, чтобы</em></span>',
      '<span style="color:#555555"><em>мир наконец заработал как следует.</em></span>',
      "",
      '<span style="color:#FF5555">✦ Проводник</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">пассивно</span>',
      '<span style="color:#AAAAAA">Каждый третий удар бьёт молнией ещё четырёх</span>',
      '<span style="color:#AAAAAA">ближайших врагов в 5 блоках: по 6 урона.</span>',
      "",
      '<span style="color:#FF5555">✦ Нет предела совершенству</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">пассивно</span>',
      '<span style="color:#AAAAAA">Каждый разряд даёт +1 урона на 10 секунд,</span>',
      '<span style="color:#AAAAAA">до +5 подряд.</span>',
      "",
      '<span style="color:#FF5555">✦ Механический фантом</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">при ударе</span>',
      '<span style="color:#AAAAAA">Удар посылает фантома на цель; нет его — зовёт.</span>',
      "",
      '<span style="color:#FF5555">✦ Малые Предвестники</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">правый клик</span>',
      '<span style="color:#AAAAAA">Двое на 30 секунд: луч смерти, ракеты, разряды.</span>',
      '<span style="color:#555555">Перезарядка 60 секунд.</span>',
      "",
      '<span style="color:#FF5555">✦ Лазерный луч</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">удерживать правый клик</span>',
      '<span style="color:#AAAAAA">Луч до стены, до 48 блоков: 3 урона всем</span>',
      '<span style="color:#AAAAAA">на линии дважды в секунду. Без перезарядки.</span>'
    ],
    stats: "Урон 14 · Скорость 1.6",
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
      '<span style="color:#555555"><em>С ним расстояние перестаёт быть препятствием.</em></span>',
      "",
      '<span style="color:#55FFFF">✦ Странствие</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">правый клик</span>',
      '<span style="color:#AAAAAA">Подъём и толчок по направлению взгляда.</span>',
      '<span style="color:#AAAAAA">Цельтесь выше и жмите снова — каждый рывок</span>',
      '<span style="color:#AAAAAA">складывается с уже набранной скоростью.</span>',
      '<span style="color:#AAAAAA">Падение после этого не ранит.</span>'
    ],
    stats: "Урон 14 · Скорость 1.6",
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
      '<span style="color:#AAAAAA">Вплавляется в клинок и меняет его природу.</span>',
      '<span style="color:#AAAAAA">ПКМ на бедроке крыши Незера (кровь 3-й формы</span>',
      '<span style="color:#AAAAAA">и выше): летит к Проклятому замку и бьётся.</span>'
    ],
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
      '<span style="color:#AAAAAA">Вплавляется в Бедствие и делает его Волей Демона.</span>'
    ],
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
      '<span style="color:#AAAAAA">Вырвано у Хранителя клинком из набора.</span>',
      '<span style="color:#AAAAAA">Им питается Реквием девятого неба.</span>'
    ],
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
      '<span style="color:#AAAAAA">Корона крови у алтаря своего храма и она</span>',
      '<span style="color:#AAAAAA">становятся Все-Чёрным. Техноорганическая</span>',
      '<span style="color:#AAAAAA">кровь отдаёт её Клоду — за четвёртую форму.</span>'
    ],
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
      '<span style="color:#AAAAAA">Висит в большом зале Терра-подземелья,</span>',
      '<span style="color:#AAAAAA">пока жив Джунглевый голем.</span>',
      '<span style="color:#AAAAAA">Кровь предков третьей формы несёт её к алтарю</span>',
      '<span style="color:#AAAAAA">Храма джунглей — за четвёртую форму.</span>',
      '<span style="color:#AAAAAA">Из неё и Адской сущности собирают Тессеракт.</span>',
      "",
      '<span style="color:#00AA00">Отравляет того, кто её носит, — кроме</span>',
      '<span style="color:#00AA00">техноорганической крови и крови предков.</span>'
    ],
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
      '<span style="color:#AAAAAA">Висит в сердце часовой башни Проклятого замка,</span>',
      '<span style="color:#AAAAAA">в поле красной энергии, пока жива её стража.</span>',
      '<span style="color:#AAAAAA">Кто подойдёт к ней — загорится; пиглины — нет.</span>',
      '<span style="color:#AAAAAA">Пепельная кровь третьей формы несёт её к алтарю</span>',
      '<span style="color:#AAAAAA">Незеритовой кузни — за четвёртую форму.</span>',
      '<span style="color:#AAAAAA">Из неё и Терра-сущности собирают Тессеракт.</span>',
      "",
      '<span style="color:#FF5555">Жжёт того, кто её носит, — какой бы ни была</span>',
      '<span style="color:#FF5555">его кровь. Огненную спасает родство с пламенем.</span>'
    ],
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
      '<span style="color:#AAAAAA">Указывает на Терра-подземелье глубоко под землёй,</span>',
      '<span style="color:#AAAAAA">где хранится Терра-сущность.</span>',
      '<span style="color:#555555">Собирает кровь предков у алтаря Храма джунглей.</span>'
    ],
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
      '<span style="color:#AAAAAA">как у Энцефало-истребителя. Предмет тратится.</span>'
    ],
    stats: "",
    obtain: "Сборка на алтаре Древней фабрики",
    icon: "images/other/897fc1caae.png",
    method: "assemble",
    methodLabel: "Сборка у алтаря",
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
      '<span style="color:#AAAAAA">Правый клик: купол радиусом 10 блоков на минуту.</span>',
      '<span style="color:#AAAAAA">В нём собираются автоматоны, до 5, по одному</span>',
      '<span style="color:#AAAAAA">в 3 секунды: бьют врагов. Предмет не тратится.</span>',
      '<span style="color:#555555">Перезарядка 2 минуты.</span>'
    ],
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
      '<span style="color:#555555"><em>Земля и пекло, запертые в одной грани.</em></span>',
      "",
      '<span style="color:#FFAA00">✦ Правый клик</span>  <span style="color:#555555">·</span>  <span style="color:#AAAAAA">кем угодно; цвет тессеракта — что он сделает</span>',
      '<span style="color:#FF5555">Красный</span><span style="color:#AAAAAA"> — в чужом куполе: ломает его.</span>',
      '<span style="color:#55FF55">Зелёный</span><span style="color:#AAAAAA"> — не всё здоровье: +50% вам и своим рядом.</span>',
      '<span style="color:#55FFFF">Голубой</span><span style="color:#AAAAAA"> — в мире: к случайному храму.</span>',
      '<span style="color:#FFAA00">Оранжевый</span><span style="color:#AAAAAA"> — в Незере: к Незеритовой кузне.</span>',
      '<span style="color:#FF55FF">Фиолетовый</span><span style="color:#AAAAAA"> — в Энде: к точке возрождения.</span>',
      '<span style="color:#AAAAAA">Переносит всех в круге 3 блоков; круг горит</span>',
      '<span style="color:#AAAAAA">ещё 5 секунд и забирает вошедших.</span>',
      '<span style="color:#555555">Серый — перезарядка: 10 минут, лечение — 5.</span>'
    ],
    stats: "",
    obtain: "Крафт: Терра-сущность, звезда Незера, Адская сущность, 6 плачущих обсидианов",
    icon: "images/icons/wanderer_cube.png",
    method: "craft",
    methodLabel: "Верстак",
    recipe: true
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
        condition: "Выковать Бедствие",
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
        gem: "#c68a4b",
        caption: "Подзорная труба"
      },
      {
        key: "genocide",
        title: "Геноцид",
        description: "Но никто не пришёл",
        frame: "challenge",
        frameLabel: "Испытание",
        condition: "Получить геноцидальное оружие",
        gem: "#3a3a3a",
        caption: "Череп скелета-иссушителя"
      },
      {
        key: "death_knocked",
        title: "Смерть постучалась",
        description: "Она приходила. Ты был занят.",
        frame: "task",
        frameLabel: "Задача",
        condition: "Пережить смертельный удар используя Все-Чёрный",
        gem: "#e8c24a",
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
        condition: "Чтобы 30 существ шли на вас одновременно",
        gem: "#4e8a3a",
        caption: "Голова зомби"
      },
      {
        key: "harmless_pet",
        title: "Безобидная зверюшка",
        description: "Слепое, сильное, безупречное. И всё-таки кончилось.",
        frame: "challenge",
        frameLabel: "Испытание",
        condition: "Убить Вардена Все-Чёрным",
        gem: "#1d5563",
        caption: "Скалк-крикун"
      },
      {
        key: "holy_promise",
        title: "Святое обещание",
        description: "Три мира видели тебя с ним в руке. Ни один не стал лучше.",
        frame: "goal",
        frameLabel: "Цель",
        condition: "Побывать с Все-Чёрным во всех трёх измерениях",
        gem: "#3fa37a",
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
        condition: "Выковать Демонический резак",
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
        condition: "Выковать Терра-резак",
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
        gem: "#2fbf5a",
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
        condition: "Выковать Убийцу демонов",
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
        gem: "#8a6a44",
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
        gem: "#7fd67a",
        caption: "Пузырёк опыта"
      },
      {
        key: "fifth_star",
        title: "Пятая звезда",
        description: "Сталь приняла всё, что ты мог ей дать.",
        frame: "goal",
        frameLabel: "Цель",
        condition: "Заточить клинок до ★5",
        gem: "#f1f1ff",
        caption: "Звезда Незера"
      },
      {
        key: "eyes_open",
        title: "Пробуждение",
        description: "Он проснулся. Надеюсь, ты не пожалеешь о том, что увидел.",
        frame: "goal",
        frameLabel: "Цель",
        condition: "Пробудить клинок",
        gem: "#3fa37a",
        caption: "Око Края"
      },
      {
        key: "blood_remembers",
        title: "Кровь помнит всё",
        description: "Сущность у алтаря, субстанция в руках машины, Серафим у твоих ног — и твоя кровь вспомнила всё.",
        frame: "challenge",
        frameLabel: "Испытание",
        condition: "Поднять кровь до четвёртой формы",
        gem: "#c0302a",
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
        condition: "Взять в руки любой клинок набора",
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
        gem: "#d6d6d6",
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
      "Ходит по лаве, как по камню (Shift — нырнуть); в Незере удары сильнее на 10%.",
      "Удар поджигает цель; кто ударит вас, загорится сам.",
      "Ниже 30% здоровья: сопротивление на 15 с и огненный шар во врага каждую секунду. Раз в 10 минут."
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
        name: "Рассекатель могил",
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
      "Голубые крылья: прыжок в воздухе и удержание — полёт. Пять зарядов, заряд в секунду, пока не летите."
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
      "Синие крылья: полёт, как у небесной крови; ночью — ночное зрение.",
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
      "Удерживать ПКМ 3 с (с Все-Чёрным, мечом или топором): тень на 10 с — невидимость, неуязвимость и иссушение II всем в чёрном облаке под вами.",
      "Смертельный удар не убивает: регенерация, а все, кого коснулась бездна Все-Чёрного, становятся жертвами — 6 урона в секунду и взрыв на 20. Раз в 10 минут."
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
      "Двойной прыжок без урона от падения; удар в прыжке стягивает врагов в 5 блоках к цели.",
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
      "Удар показывает здоровье цели; реактивные сапоги на 5 с.",
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
        name: "Энцефало-истребитель",
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
    ],
    note: "Алмаз в центре, восемь изумрудных блоков вокруг."
  },
  {
    result: "calamity",
    grid: [
      "doom",
      "demon_soul",
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    shapeless: true,
    note: "Погибель и Душа демона в любых клетках."
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
    shapeless: true,
    note: "Резак и Душа демона в любых клетках."
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
    shapeless: true,
    note: "Арахнид и Душа демона в любых клетках."
  },
  {
    result: "demon_will",
    grid: [
      "calamity",
      "wither_soul",
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ],
    shapeless: true,
    note: "Бедствие и Душа Иссушителя в любых клетках."
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
    ],
    note: "Демонический резак в центре, восемь терра-слитков вокруг."
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
    note: "Средний ряд: Терра-сущность, звезда Незера, Адская сущность (можно и зеркально); сверху и снизу — плачущий обсидиан."
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
    ],
    note: "Компас в центре, четыре заряда ветра крестом."
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
    ],
    note: "Пустая карта в центре, четыре незерских кирпича крестом."
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
    ],
    note: "Пустая карта в центре, четыре изумруда крестом."
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
    shapeless: true,
    note: "Компас воздуха и звезда Незера в любых клетках."
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
  emerald: "Изумруд"
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
