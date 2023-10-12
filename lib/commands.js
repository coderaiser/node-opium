
const rendy = require('rendy');

module.exports.put = (path, data = '') => {
    if (path.endsWith('/'))
        return rendy(`put --type directory --path {{ path }}`, {
            path,
        });
    
    const values = {
        path,
        data,
    };
    
    return rendy(`put --type file --path {{ path }} --format base64 --data {{ data | btoa }}`, values, {
        btoa,
    });
}

module.exports.move = (from, to, files) => {
    return rendy(`move --from {{ from }} --to {{ to }} --files {{ files }}`, {
        from,
        to,
        files,
    });
}
