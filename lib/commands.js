import rendy from 'rendy';

export const put = (path, data = '') => {
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
};

export const move = (from, to, files) => {
    return rendy(`move --from {{ from }} --to {{ to }} --files {{ files }}`, {
        from,
        to,
        files,
    });
};

export const drop = (path, files) => {
    return `drop --path ${path} --files ${files}`;
};
