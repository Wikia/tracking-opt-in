// ToDo: Rewrite the logic and get rid of this method
function objectToArray(object) {
    const array = [];

    for (let [key, value] of Object.entries(object)) {
        array[key] = value;
    }

    return array;
}

export default objectToArray;
