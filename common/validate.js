'use strict';


const _regexpMap = {
    'required': value => !!value && !(/^\s*$/.test(value)),
    'match': (value, regexp) => regexp.test(value),
    'number': value => typeof value === 'number' && isFinite(value)
};

const validateField = (fields, regexpList) => {
    const regexpMap = _regexpMap;
    let result = null;
    for (const field of Object.keys(regexpList)) {
        const validateList = regexpList[field];
        validateList.forEach(validate => {
            if (validate.type === 'match') {
                if (!regexpMap.match(fields[field], validate.value)) {
                    result = new Error(validate.msg);
                }
            } else {
                if (!regexpMap[validate.type](fields[field])) {
                    result = Error(validate.msg);
                }
            }
        });
    }
    return result;
};


module.exports = validateField;
