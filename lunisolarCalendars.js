//|-----------------------------|
//|     Lunisolar Calendars     |
//|-----------------------------|

// A set of functions for calculating dates in the Lunisolar Calendars category.

function getChineseZodiacYear(year_) {
    let zodiacAnimals = ['鼠 (Rat)', '牛 (Ox)', '虎 (Tiger)', '兔 (Rabbit)', '龍 (Dragon)', '蛇 (Snake)', '馬 (Horse)', '羊 (Goat)', '猴 (Monkey)', '雞 (Rooster)', '狗 (Dog)', '豬 (Pig)'];
    // Adjusting for the start of the Chinese zodiac cycle, handling negative years
    let index = year_ >= 4 ? (year_ - 4) % 12 : ((Math.abs(year_) + 8) % 12 === 0 ? 0 : 12 - ((Math.abs(year_) + 8) % 12));
    if (year_ < 0) {
        index++;
    }
    return zodiacAnimals[index];
}

function getVietnameseZodiacYear(year_) {
    let zodiacAnimals = ['𤝞 (Rat)', '𤛠 (Water Buffalo)', '𧲫 (Tiger)', '猫 (Cat)', '龍 (Dragon)', '𧋻 (Snake)', '馭 (Horse)', '羝 (Goat)', '𤠳 (Monkey)', '𪂮 (Rooster)', '㹥 (Dog)', '㺧 (Pig)'];
    // Adjusting for the start of the Chinese zodiac cycle, handling negative years
    let index = year_ >= 4 ? (year_ - 4) % 12 : ((Math.abs(year_) + 8) % 12 === 0 ? 0 : 12 - ((Math.abs(year_) + 8) % 12));
    if (year_ < 0) {
        index++;
    }
    return zodiacAnimals[index];
}

function getSexagenaryYear(year_) {
    let heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    let earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    let heavenlyStemsEnglish = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
    let earthlyBranchesEnglish = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
    
    // Ensure year_ is positive before calculating indices
    let positiveYear = year_ < 0 ? 60 + (year_ % 60) : year_;

    let heavenlyStemIndex = (positiveYear - 4) % 10; // Adjusting for the start of the sexagenary cycle
    let earthlyBranchIndex = (positiveYear - 4) % 12; // Adjusting for the start of the sexagenary cycle

    if (year_ < 0) {
        heavenlyStemIndex++;
        earthlyBranchIndex++;
    }
    
    let heavenlyStem = heavenlyStems[heavenlyStemIndex];
    let earthlyBranch = earthlyBranches[earthlyBranchIndex];
    let heavenlyStemEnglish = heavenlyStemsEnglish[heavenlyStemIndex];
    let earthlyBrancheEnglish = earthlyBranchesEnglish[earthlyBranchIndex];
    
    return heavenlyStem + earthlyBranch + ' (' + heavenlyStemEnglish + earthlyBrancheEnglish + ')';
}