const automatas_fetch = (() => {

    const _get = (url, fnExito, fnFallo) => {
        fetch(url).
            then((resp) => resp.json()).
            then(fnExito).catch(fnFallo);
    };

    const _put = (url, data)=>{
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        }).
        then((resp) => resp.json()).
        then(
            compras_functions.updateInfo
        ).catch(compras_functions.logError);
    };

    const _post = (url, data,funcExito,funcError) => {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        }).
        then((resp) => resp.json()).
        then(funcExito).catch(compras_functions.funcError);
    };

    const _delete = (url) => {
        fetch(url, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        }).
        then((resp) => resp.json()).
        then(compras_functions.updateInfo).catch(compras_functions.logError);
    };

    return {
        get: _get,
        post:_post,
        delete:_delete,
        put:_put
    };
})();