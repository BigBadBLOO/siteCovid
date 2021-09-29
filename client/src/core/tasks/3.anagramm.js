function anagramm(str1, str2) {
    const arrayChar = str2.trim().toLowerCase().split('');

    for(let i=0; i< str1.length; i++){
        const index = arrayChar.indexOf(str1[i].toLowerCase());
        if(arrayChar.indexOf(str1[i].toLowerCase()) < 0){
            return false
        }else{
            arrayChar.splice(index, 1);
        }
    }
    return true
}

console.log(anagramm('Finder', 'Friend'));
console.log(anagramm('Finden', 'Friend'));