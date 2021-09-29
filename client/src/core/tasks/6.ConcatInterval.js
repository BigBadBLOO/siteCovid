function concatInterval(...args) {
   return args.reduce((acc, arr) => {
        const [firstElem, secondElem] = arr;
        let useElem = false;
        acc.forEach(resultArr => {
            const [firstElemResult, secondElemResult] = resultArr;
            if(firstElem < firstElemResult && secondElem >= firstElemResult){
                resultArr[0] = firstElem;
                useElem = true
            }else if(secondElem > secondElemResult && firstElem <= secondElemResult){
                resultArr[1] = secondElem;
                useElem = true;
            }else useElem = secondElem <= secondElemResult && firstElem >= firstElemResult;
        });
        if(!useElem) acc.push(arr);
        return acc
    },[]);
}

console.log(concatInterval([1,5],[3,7],[4,6],[6,8],[10,12],[12,15]));