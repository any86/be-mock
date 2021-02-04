import axios from 'axios';
import qs from 'qs';
import $app from '../main';
function getTokenFromCache(){};
const $http = axios.create({
    // baseURL: process.env.VUE_APP_API_BASE_URL,
    baseURL:'http://127.0.0.1:3000',
    timeout: 30000,
    headers: {
        // token: getTokenFromCache()
        token: 'tonyxxx'
    },

    paramsSerializer(params) {
        // return 'query=' + encodeURIComponent(JSON.stringify(params));
        return qs.stringify(params, {
            arrayFormat: 'repeat'
        });
    },

    validateStatus: function (status) {
        if (400 <= status) {

            if (401 == status) {
                $app.$router.push({
                    path: '/login'
                });
                // $app.$Message.warning('登陆凭证失效, 请重新登录!');
            } else {
                $app.$Modal.error({
                    content: `代码:${status}`,
                    title: '错误'
                });
            }
        } else {
            return status >= 200 && status < 300; // default
        }
    },
});

$http.interceptors.response.use(function (response) {
    const {
        config,
        data
    } = response;
    const {
        code,
        msg
    } = data;
    const {
        method
    } = config;
    if ('post' === method) {
        if (1 == code) {
            if (config.url != "/examination/doExamine") {
                $app.$Message.success(msg);
            }
        } else if (0 == code) {
            $app.$Modal.error({
                title: '错误',
                content: msg
            });
        }
    } else if ('get' === method) {
        if (0 == code && !['prom/LinuxInfo_NodeLoad', 'prom/LinuxInfo_Hwmon', 'prom/LinuxInfo_Network', 'prom/LinuxInfo_TcpNum'].includes(config.url)) {
            $app.$Notice.info({
                title: '提示',
                desc: msg
            });
        }
    };
    return response;
}, function (error) {
    // $app.$Modal.error({
    //     title: '错误',
    //     content: error
    // });
    return Promise.reject(error);
});

/**
 * 设置token
 * @param {String} token 
 */
const setHttpToken = token => {
    $http.defaults.headers['token'] = token;
};

// 校验是否token已过期
const isTokenExpire = () => $http.get('/system/decode_token');

// 获取菜单

// 简化返回数据
$http.interceptors.response.use(function (response) {
    if ('string' === typeof response.data.data) {
        response.data.data = JSON.parse(response.data.data);
    }
    return response.data;
}, function (error) {
    return Promise.reject(error);
});

export {
    isTokenExpire,
    setHttpToken,
    $http
};
