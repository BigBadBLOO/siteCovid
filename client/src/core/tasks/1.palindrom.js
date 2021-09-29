function palindrom(str) {
    const strForWork = str.toLowerCase().trim();
    for(let i=0; i < strForWork.length/2; i++){
        if(strForWork[i] !== strForWork[strForWork.length - i -1]){
            return false
        }
    }
    return true
}


console.log(palindrom('Anna'));
console.log(palindrom('Anla'));
console.log(palindrom('Ankna'));