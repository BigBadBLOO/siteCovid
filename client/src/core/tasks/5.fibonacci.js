function fibonacci(n) {
    if(n < 1) return 0;
    if(n === 1 || n === 2) return 1;
    let result = [1,1];
    let start = 1;
    while (start < n - 1){
        result.push(result[start] + result[start - 1]);
        start += 1
    }
    return result[n - 1]
}
console.log(fibonacci(1477));