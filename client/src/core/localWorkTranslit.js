const alt_word_maker = {
    'q': 'й',
    'w': 'ц',
    'e': 'у',
    'r': 'к',
    't': 'е',
    'y': 'н',
    'u': 'г',
    'i': 'ш',
    'o': 'щ',
    'p': 'з',
    '[': 'х',
    ']': 'ъ',
    '{': 'х',
    '}': 'ъ',
    'a': 'ф',
    's': 'ы',
    'd': 'в',
    'f': 'а',
    'g': 'п',
    'h': 'р',
    'j': 'о',
    'k': 'л',
    'l': 'д',
    ';': 'ж',
    ':': 'ж',
    '\'': 'э',
    '\"': 'э',
    'z': 'я',
    'x': 'ч',
    'c': 'с',
    'v': 'м',
    'b': 'и',
    'n': 'т',
    'm': 'ь',
    ',': 'б',
    '.': 'ю',
    '`': 'ё',
    '<': 'б',
    '>': 'ю',
    '~': 'ё',
};

String.prototype.altWordMaker = function() {
    let result = '';
    let text = this.split('');
    for (let i = 0; i < text.length; i++) {
        if (alt_word_maker[text[i].toLowerCase()] !== undefined) {
            result += alt_word_maker[text[i].toLowerCase()];
        }
        else {
            result += text[i];
        }
    }
    return result;
};