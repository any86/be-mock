export const of = Object.freeze;
export const API_METHODS = of(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']);

const VAR_TYPE_STRING = 'String';
const VAR_TYPE_NUMBER = 'Number';
const VAR_TYPE_ARRAY = 'Array';
const VAR_TYPE_OBJECT = 'Object';
const VAR_TYPE_NULL = 'Null';
const VAR_TYPE_BOOLEAN = 'Boolean';

export const VAR_TYPE_LIST = of([
    VAR_TYPE_STRING,
    VAR_TYPE_NUMBER,
    VAR_TYPE_ARRAY,
    VAR_TYPE_OBJECT,
    VAR_TYPE_BOOLEAN,
    VAR_TYPE_NULL]);

export const VAR_TYPE = of({
    String: VAR_TYPE_STRING,
    Number: VAR_TYPE_NUMBER,
    Array: VAR_TYPE_ARRAY,
    Object: VAR_TYPE_OBJECT,
    Boolean: VAR_TYPE_BOOLEAN,
    Null: VAR_TYPE_NULL,
})

export const VAR_COLOR_MAP = of({
    String: '#28a745',
    Number: '#3190ff',
    Object: '#9c27b0',
    Array: '#dc3545',
    Null: '#4dd0e1',
});

export const METHOD_LIST = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];