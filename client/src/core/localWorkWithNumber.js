export function get_two(number) {
    return number < 10 ? '0' + number : '' + (number % 100);
}

export function get_int(text) {
    var result = 0;
    var i;
    if(typeof text === 'string') {
        var byf = text.split('');
        for (i = 0; i < byf.length; i++) {
            if (!is_int(byf[i])) {
                byf = text.substring(0, i).split('');
                break;
            }
        }
        for (i = 0; i < byf.length; i++) {
            result += parseInt(byf[i]) * Math.pow(10, byf.length - i - 1);
        }
    }
    else {
        result = text;
    }

    return result;
}

export function is_int(text) {
    return parseInt(text) === parseInt(text);
}

export function randomInt(min, max) {
    const rand = min + Math.random()* (max - min + 1)
    return Math.floor(rand)
}