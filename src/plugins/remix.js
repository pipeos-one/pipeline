/* eslint-disable */

const _createClass = (function () {
    function defineProperties(target, props) {
        for (let i = 0; i < props.length; i++) {
            const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor);
        }
    } return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor;
    };
}());

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

export function RemixExtension() {
    const _this = this;

    _classCallCheck(this, RemixExtension);

    this._notifications = {};
    this._pendingRequests = {};
    this._id = 0;
    window.addEventListener('message', event => _this._newMessage(event), false);
}

_createClass(RemixExtension, [{
    key: 'listen',
    value: function listen(key, type, callback) {
        if (!this._notifications[key]) this._notifications[key] = {};
        this._notifications[key][type] = callback;
    },
}, {
    key: 'call',
    value: function call(key, type, params, callback) {
        this._id++;
        this._pendingRequests[this._id] = callback;
        window.parent.postMessage(JSON.stringify({
            action: 'request',
            key,
            type,
            value: params,
            id: this._id,
        }), '*');
    },
}, {
    key: '_newMessage',
    value: function _newMessage(event) {
        if (!event.data) return;
        if (typeof event.data !== 'string') return;

        let msg;
        try {
            msg = JSON.parse(event.data);
        } catch (e) {
            return console.log('unable to parse data');
        }
        const _msg = msg;


        const action = _msg.action;


        const key = _msg.key;


        const type = _msg.type;


        const value = _msg.value;

        if (action === 'notification') {
            if (this._notifications[key] && this._notifications[key][type]) {
                this._notifications[key][type](value);
            }
        } else if (action === 'response') {
            const _msg2 = msg;


            const id = _msg2.id;


            const error = _msg2.error;

            if (this._pendingRequests[id]) {
                this._pendingRequests[id](error, value);
                delete this._pendingRequests[id];
            }
        }
    },
}]);
