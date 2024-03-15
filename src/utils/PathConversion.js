function getPosition(value) {
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

function getUserAvatar(id, value, axios) {
    return value && value !== ""
        ? `${axios.defaults.baseURL}/profile/${id}/avatar/download/${
              value.split("~")[0]
          }`
        : undefined;
}

function getResourceCover(id, value, axios) {
    return value && value !== ""
        ? `${axios.defaults.baseURL}/resource/${id}/cover/download/${
              value.split("~")[0]
          }`
        : undefined;
}

function getCollectionCover(id, value, axios) {
    return value && value !== ""
        ? `${axios.defaults.baseURL}/collection/${id}/cover/download/${
              value.split("~")[0]
          }`
        : undefined;
}

function getMediaFile(item, axios) {
    return item.id !== undefined &&
        item.id !== 0 &&
        item.files !== undefined &&
        item.files.length > 0 &&
        item.files[0] !== ""
        ? `${axios.defaults.baseURL}/file/${item.id}/download/${item.files[0]}`
        : undefined;
}

export {
    getPosition,
    getUserAvatar,
    getResourceCover,
    getCollectionCover,
    getMediaFile,
};
