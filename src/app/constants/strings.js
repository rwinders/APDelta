var API_KEY = "522499d5-cb38-4e8c-a979-adf2526ab310";
var SERVER_URL = "http://127.0.0.1:3000";
var totalGames = {
    "na-5-11": 9598,
    "na-5-14": 9979,
    "euw-5-11": 9286,
    "euw-5-14": 9944,
    "eune-5-11": 9973,
    "eune-5-14": 8975,
    "kr-5-11": 9912,
    "kr-5-14": 9986
}
var idToItems = {
    "1026": "Blasting Wand",
    "1052": "Amplifying Tome",
    "1056": "Doran's Ring",
    "1058": "Needlessly Large Rod",
    "2139": "Elixir of Sorcery",
    "3001": "Abyssal Scepter",
    "3003": "Archangel's Staff",
    "3023": "Twin Shadows",
    "3025": "Iceborn Gauntlet",
    "3027": "Rod of Ages",
    "3041": "Mejai's Soulstealer",
    "3050": "Zeke's Harbinger",
    "3057": "Sheen",
    "3060": "Banner of Command",
    "3089": "Rabadon's Deathcap",
    "3092": "Frost Queen's Claim",
    "3098": "Frostfang",
    "3100": "Lich Bane",
    "3108": "Fiendish Codex",
    "3113": "Aether Wisp",
    "3115": "Nashor's Tooth",
    "3116": "Rylai's Crystal Scepter",
    "3135": "Void Staff",
    "3136": "Haunting Guise",
    "3145": "Hextech Revolver",
    "3146": "Hextech Gunblade",
    "3151": "Liandry's Torment",
    "3152": "Will of the Ancients",
    "3157": "Zhonya's Hourglass",
    "3165": "Morellonomicon",
    "3174": "Athene's Unholy Grail",
    "3191": "Seeker's Armguard",
    "3196": "The Hex Core mk-1",
    "3197": "The Hex Core mk-2",
    "3198": "Perfect Hex Core",
    "3285": "Luden's Echo",
    "3303": "Spellthief's Edge",
    "3504": "Ardent Censer"
}
var idToChampions = {
    "1": "Annie",
    "2": "Olaf",
    "3": "Galio",
    "4": "TwistedFate",
    "5": "XinZhao",
    "6": "Urgot",
    "7": "Leblanc",
    "8": "Vladimir",
    "9": "FiddleSticks",
    "10": "Kayle",
    "11": "MasterYi",
    "12": "Alistar",
    "13": "Ryze",
    "14": "Sion",
    "15": "Sivir",
    "16": "Soraka",
    "17": "Teemo",
    "18": "Tristana",
    "19": "Warwick",
    "20": "Nunu",
    "21": "MissFortune",
    "22": "Ashe",
    "23": "Tryndamere",
    "24": "Jax",
    "25": "Morgana",
    "26": "Zilean",
    "27": "Singed",
    "28": "Evelynn",
    "29": "Twitch",
    "30": "Karthus",
    "31": "Chogath",
    "32": "Amumu",
    "33": "Rammus",
    "34": "Anivia",
    "35": "Shaco",
    "36": "DrMundo",
    "37": "Sona",
    "38": "Kassadin",
    "39": "Irelia",
    "40": "Janna",
    "41": "Gangplank",
    "42": "Corki",
    "43": "Karma",
    "44": "Taric",
    "45": "Veigar",
    "48": "Trundle",
    "50": "Swain",
    "51": "Caitlyn",
    "53": "Blitzcrank",
    "54": "Malphite",
    "55": "Katarina",
    "56": "Nocturne",
    "57": "Maokai",
    "58": "Renekton",
    "59": "JarvanIV",
    "60": "Elise",
    "61": "Orianna",
    "62": "MonkeyKing",
    "63": "Brand",
    "64": "LeeSin",
    "67": "Vayne",
    "68": "Rumble",
    "69": "Cassiopeia",
    "72": "Skarner",
    "74": "Heimerdinger",
    "75": "Nasus",
    "76": "Nidalee",
    "77": "Udyr",
    "78": "Poppy",
    "79": "Gragas",
    "80": "Pantheon",
    "81": "Ezreal",
    "82": "Mordekaiser",
    "83": "Yorick",
    "84": "Akali",
    "85": "Kennen",
    "86": "Garen",
    "89": "Leona",
    "90": "Malzahar",
    "91": "Talon",
    "92": "Riven",
    "96": "KogMaw",
    "98": "Shen",
    "99": "Lux",
    "101": "Xerath",
    "102": "Shyvana",
    "103": "Ahri",
    "104": "Graves",
    "105": "Fizz",
    "106": "Volibear",
    "107": "Rengar",
    "110": "Varus",
    "111": "Nautilus",
    "112": "Viktor",
    "113": "Sejuani",
    "114": "Fiora",
    "115": "Ziggs",
    "117": "Lulu",
    "119": "Draven",
    "120": "Hecarim",
    "121": "Khazix",
    "122": "Darius",
    "126": "Jayce",
    "127": "Lissandra",
    "131": "Diana",
    "133": "Quinn",
    "134": "Syndra",
    "143": "Zyra",
    "150": "Gnar",
    "154": "Zac",
    "157": "Yasuo",
    "161": "Velkoz",
    "201": "Braum",
    "222": "Jinx",
    "223": "TahmKench",
    "236": "Lucian",
    "238": "Zed",
    "245": "Ekko",
    "254": "Vi",
    "266": "Aatrox",
    "267": "Nami",
    "268": "Azir",
    "412": "Thresh",
    "421": "RekSai",
    "429": "Kalista",
    "432": "Bard"
}

var itemsToId = {
    "Blasting Wand": "1026",
    "Amplifying Tome": "1052",
    "Doran's Ring": "1056",
    "Needlessly Large Rod": "1058",
    "Elixir of Sorcery": "2139",
    "Abyssal Scepter": "3001",
    "Archangel's Staff": "3003",
    "Twin Shadows": "3023",
    "Iceborn Gauntlet": "3025",
    "Rod of Ages": "3027",
    "Mejai's Soulstealer": "3041",
    "Zeke's Harbinger": "3050",
    "Sheen": "3057",
    "Banner of Command": "3060",
    "Rabadon's Deathcap": "3089",
    "Frost Queen's Claim": "3092",
    "Frostfang": "3098",
    "Lich Bane": "3100",
    "Fiendish Codex": "3108",
    "Aether Wisp": "3113",
    "Nashor's Tooth": "3115",
    "Rylai's Crystal Scepter": "3116",
    "Guinsoo's Rageblade": "3124",
    "Void Staff": "3135",
    "Haunting Guise": "3136",
    "Hextech Revolver": "3145",
    "Hextech Gunblade": "3146",
    "Liandry's Torment": "3151",
    "Will of the Ancients": "3152",
    "Zhonya's Hourglass": "3157",
    "Morellonomicon": "3165",
    "Athene's Unholy Grail": "3174",
    "Seeker's Armguard": "3191",
    "The Hex Core mk-1": "3196",
    "The Hex Core mk-2": "3197",
    "Perfect Hex Core": "3198",
    "Luden's Echo": "3285",
    "Spellthief's Edge": "3303",
    "Ardent Censer": "3504"
}

var championsToId = {
    "Annie": "1",
    "Olaf": "2",
    "Galio": "3",
    "TwistedFate": "4",
    "XinZhao": "5",
    "Urgot": "6",
    "Leblanc": "7",
    "Vladimir": "8",
    "FiddleSticks": "9",
    "Kayle": "10",
    "MasterYi": "11",
    "Alistar": "12",
    "Ryze": "13",
    "Sion": "14",
    "Sivir": "15",
    "Soraka": "16",
    "Teemo": "17",
    "Tristana": "18",
    "Warwick": "19",
    "Nunu": "20",
    "MissFortune": "21",
    "Ashe": "22",
    "Tryndamere": "23",
    "Jax": "24",
    "Morgana": "25",
    "Zilean": "26",
    "Singed": "27",
    "Evelynn": "28",
    "Twitch": "29",
    "Karthus": "30",
    "Chogath": "31",
    "Amumu": "32",
    "Rammus": "33",
    "Anivia": "34",
    "Shaco": "35",
    "DrMundo": "36",
    "Sona": "37",
    "Kassadin": "38",
    "Irelia": "39",
    "Janna": "40",
    "Gangplank": "41",
    "Corki": "42",
    "Karma": "43",
    "Taric": "44",
    "Veigar": "45",
    "Trundle": "48",
    "Swain": "50",
    "Caitlyn": "51",
    "Blitzcrank": "53",
    "Malphite": "54",
    "Katarina": "55",
    "Nocturne": "56",
    "Maokai": "57",
    "Renekton": "58",
    "JarvanIV": "59",
    "Elise": "60",
    "Orianna": "61",
    "MonkeyKing": "62",
    "Brand": "63",
    "LeeSin": "64",
    "Vayne": "67",
    "Rumble": "68",
    "Cassiopeia": "69",
    "Skarner": "72",
    "Heimerdinger": "74",
    "Nasus": "75",
    "Nidalee": "76",
    "Udyr": "77",
    "Poppy": "78",
    "Gragas": "79",
    "Pantheon": "80",
    "Ezreal": "81",
    "Mordekaiser": "82",
    "Yorick": "83",
    "Akali": "84",
    "Kennen": "85",
    "Garen": "86",
    "Leona": "89",
    "Malzahar": "90",
    "Talon": "91",
    "Riven": "92",
    "KogMaw": "96",
    "Shen": "98",
    "Lux": "99",
    "Xerath": "101",
    "Shyvana": "102",
    "Ahri": "103",
    "Graves": "104",
    "Fizz": "105",
    "Volibear": "106",
    "Rengar": "107",
    "Varus": "110",
    "Nautilus": "111",
    "Viktor": "112",
    "Sejuani": "113",
    "Fiora": "114",
    "Ziggs": "115",
    "Lulu": "117",
    "Draven": "119",
    "Hecarim": "120",
    "Khazix": "121",
    "Darius": "122",
    "Jayce": "126",
    "Lissandra": "127",
    "Diana": "131",
    "Quinn": "133",
    "Syndra": "134",
    "Zyra": "143",
    "Gnar": "150",
    "Zac": "154",
    "Yasuo": "157",
    "Velkoz": "161",
    "Braum": "201",
    "Jinx": "222",
    "TahmKench": "223",
    "Lucian": "236",
    "Zed": "238",
    "Ekko": "245",
    "Vi": "254",
    "Aatrox": "266",
    "Nami": "267",
    "Azir": "268",
    "Thresh": "412",
    "RekSai": "421",
    "Kalista": "429",
    "Bard": "432"
}