export function getPosition(value) {
    let position = [100, 0, 0];
    if (value && value != "") {
        position = value
            .split("~")[1]
            .split(";")
            .map((it) => {
                return parseInt(it);
            });
    }
    return {
        size: parseInt(position[0]),
        x: parseInt(position[1]),
        y: parseInt(position[2]),
    };
}
