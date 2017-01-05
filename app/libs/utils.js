exports.parse = (regEx, data) => {
    var results = [],
        match = regEx.exec(data);
    while (match !== null) {
        results.push(match[1]);
        match = regEx.exec(data);
    }
    return results;
}
