function fizzBuzz(n) {
    for(let i = 1; i <= n; i++){
        if(i%5 === 0 || i%3 === 0) console.log('FizzBuzz');
        else console.log(i);
    }
}

fizzBuzz(5);
fizzBuzz(10);