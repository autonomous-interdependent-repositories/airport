export function strsToNums(strings) {
    return strings.map(str => parseInt(str));
}
export function objectExists(object) {
    return object !== null && object !== undefined;
}
export function valuesEqual(value1, value2, checkChildObjects = false) {
    if (typeof value1 === 'object') {
        if (value1 instanceof Date) {
            if (value2 instanceof Date) {
                return value1.getTime() === value2.getTime();
            }
            else {
                return false;
            }
        }
        else {
            if (typeof value2 !== 'object') {
                return false;
            }
            if (!checkChildObjects) {
                // Skip child objects
                return true;
            }
            let checkedKeys = {};
            for (let key in value1) {
                checkedKeys[key] = true;
                if (!valuesEqual(value1[key], value2[key], checkChildObjects)) {
                    return false;
                }
            }
            for (let key in value2) {
                if (!checkedKeys[key]) {
                    return false;
                }
            }
            return true;
        }
    }
    if (!value1) {
        if (value1 === '') {
            return value2 === '';
        }
        else if (value1 === false) {
            return value2 === false;
        }
        else if (value1 === 0) {
            return value2 === 0;
        }
        if (value2 === '' || value2 === false || value2 === 0) {
            return false;
        }
        // treat undefined and null as same value
        return (!value2);
    }
    if (!value2) {
        return false;
    }
    return value1 === value2;
}
export function compareNumbers(number1, number2) {
    if (number1 < number2) {
        return -1;
    }
    if (number1 > number2) {
        return 1;
    }
    return 0;
}
//# sourceMappingURL=Utils.js.map