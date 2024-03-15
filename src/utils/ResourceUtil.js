function setSelected(item, value) {
    for (let i = 0; i < value.length; i++) {
        if (!value[i].status) {
            let index = item.selected.findIndex((it) => it === value[i].id);
            item.selected.splice(index, 1);
        } else {
            item.selected.push(value[i].id);
        }
    }
}

export { setSelected };
