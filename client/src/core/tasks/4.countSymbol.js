const arrayChar = ['e','y', 'u', 'i', 'o', 'a'];
function count(str) {
    let result = 0;
    for(let i=0; i< str.length; i++){
        if(arrayChar.indexOf(str[i].toLowerCase()) >= 0){
            result += 1;
        }
    }
    return result
}

console.log(count('Finder'));
console.log(count('Fedora'));