import mockjs from 'mockjs';
import {
    of,
} from '../const';
// 字符串类型
const MOCK_TYPE_NUMBER = 'Number';
const MOCK_TYPE_PHONE = 'Phone';
const MOCK_TYPE_EMAIL = 'Email';
const MOCK_TYPE_IP4 = 'IPv4';
const MOCK_TYPE_IP6 = 'IPv6';
const MOCK_TYPE_URL = 'URL';
const MOCK_TYPE_POOL = 'Pool';
const MOCK_TYPE_DATE = 'Date';
const MOCK_TYPE_LETTER = 'Letter';
const MOCK_TYPE_OTHER = 'Other';


// 字符串类型
export const MOCK_TYPES = of([
    MOCK_TYPE_OTHER,
    MOCK_TYPE_NUMBER,
    MOCK_TYPE_POOL,
    MOCK_TYPE_LETTER,
    MOCK_TYPE_DATE,
    MOCK_TYPE_PHONE,
    MOCK_TYPE_EMAIL,
    MOCK_TYPE_URL,
    MOCK_TYPE_IP4,
    // MOCK_TYPE_IP6,
]);

// 字符串类型 => 显示名映射
export const MOCK_TYPE = {
    [MOCK_TYPE_NUMBER]: '数字',
    [MOCK_TYPE_PHONE]: '手机号',
    [MOCK_TYPE_EMAIL]: '邮箱',
    [MOCK_TYPE_IP4]: 'IP',
    [MOCK_TYPE_IP6]: MOCK_TYPE_IP6,
    [MOCK_TYPE_POOL]: '字符集合',
    [MOCK_TYPE_URL]: '链接',
    [MOCK_TYPE_OTHER]: '普通字符串',
    [MOCK_TYPE_DATE]: '日期',
    [MOCK_TYPE_LETTER]: '纯英文'
};

// 正则
const REGXP_PHONE = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
const REGXP_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const REGXP_IP4 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
const REGXP_IP6 = /^(?:(?:(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))|\[(?:(?:(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))\](?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/i
const REGXP_NUMBER = /^\d+$/;
const REGXP_URL = /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
const REGXP_DATE = /^\d{2,4}(-|\/)(1[0-2]|0?\d)\1([0-2]\d|\d|30|31)/;
const REGXP_LETTER = /^[a-zA-Z\s]+$/

// export function getNumberType(number) {
//     if (REGXP_PHONE.test(string)) {
//         return MOCK_TYPE_PHONE;
//     }
// }

/**
 * 获取字符串的具体类型
 * @param {String} 输入 
 * @return {String} 类型
 */
export function getStringType(string) {
    // 电话号判断必须放在数字判断前面
    if (REGXP_PHONE.test(string)) {
        return MOCK_TYPE_PHONE;
    }
    // ip
    else if (REGXP_IP4.test(string)) {
        return MOCK_TYPE_IP4;
    }

    // email
    else if (REGXP_EMAIL.test(string)) {
        return MOCK_TYPE_EMAIL;
    }
    // 网址
    else if (REGXP_URL.test(string)) {
        return MOCK_TYPE_URL;
    }
    // ipv6
    else if (REGXP_IP6.test(string)) {
        return MOCK_TYPE_IP6;
    }
    // 日期
    else if (REGXP_DATE.test(string)) {
        return MOCK_TYPE_DATE;
    }
    // 纯英文
    else if (REGXP_LETTER.test(string)) {
        return MOCK_TYPE_LETTER;
    }
    // 正整数, 放在最后, 范围太大了
    else if (REGXP_NUMBER.test(string)) {
        return MOCK_TYPE_NUMBER;
    }
    // 其他
    else {
        return MOCK_TYPE_OTHER;
    }
}

// 给mockString函数消费
const MOCK_FUNCTION_MAP = {
    [MOCK_TYPE_NUMBER]({ min, max }) {
        return '' + mockjs.Random.natural(min, max);
    },
    [MOCK_TYPE_PHONE]() {
        return '1' + mockjs.Random.string('3456789', 1, 1) + mockjs.Random.string('0123456789', 9, 9);
    },

    [MOCK_TYPE_URL]() {
        return mockjs.Random.image(`${mockjs.Random.natural(1000, 2000)}x${mockjs.Random.natural(1000, 2000)}`, mockjs.Random.hex());
    },

    [MOCK_TYPE_EMAIL]() {
        return mockjs.Random.email();
    },
    [MOCK_TYPE_IP4]() {
        return mockjs.Random.ip();
    },

    [MOCK_TYPE_DATE]() {
        return mockjs.Random.datetime();
    },

    [MOCK_TYPE_LETTER]({ min, max }) {
        return mockjs.Random.word(min, max);
    },
};
/**
 * 根据具体的字符串类型来生成假数据
 * @param {String} 假数据类型
 * @param {Number} 最大长度
 * @param {Number} 最小长度
 * @param {String} 字符集
 * @return {String} 假数据
 */
export function mockString({ type, max, min, pool }) {
    if (MOCK_FUNCTION_MAP[type]) {
        return MOCK_FUNCTION_MAP[type]({ min, max, pool });
    } else if (MOCK_TYPE_POOL === type) {
        return mockjs.Random.pick(pool.split(','));
    } else {
        return mockjs.Random.cword(min, max);
    }
};

// export function mockNumber(type, ...args) {
//     if (MOCK_FUNCTION_MAP[type]) {
//         return MOCK_FUNCTION_MAP[type](...args);
//     } else {
//         return mockjs.Random.natural(Math.pow(10, args[0]), Math.pow(10, args[1]));
//     }
// };


export function createMockConfig(type = MOCK_TYPE_POOL) {
    return {
        type,
        times: 1,
        max: 7,
        min: 0,
        pool: '白日依山尽,黄河入海流,欲穷千里目,更上一层楼',
    }
};