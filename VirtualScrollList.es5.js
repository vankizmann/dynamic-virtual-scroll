'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.VirtualScrollList = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _dynamicVirtualScroll = require('dynamic-virtual-scroll');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * A simple React list with virtual scrolling based on dynamic-virtual-scroll driver
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * USUALLY sufficient for everything including grids (using absolute sizing of cells).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Just because browsers can't do virtualized grid or table layouts efficiently.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var VirtualScrollList = exports.VirtualScrollList = function (_React$Component) {
    _inherits(VirtualScrollList, _React$Component);

    function VirtualScrollList() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, VirtualScrollList);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = VirtualScrollList.__proto__ || Object.getPrototypeOf(VirtualScrollList)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            targetHeight: 0,
            topPlaceholderHeight: 0,
            firstMiddleItem: 0,
            middleItemCount: 0,
            middlePlaceholderHeight: 0,
            lastItemCount: 0,
            scrollTo: 0,
            scrollTimes: 0
        }, _this.setItemRef = [], _this.itemRefs = [], _this.itemRefCount = [], _this.setViewport = function (e) {
            _this.viewport = e;
        }, _this.getRenderedItemHeight = function (index) {
            if (_this.itemRefs[index]) {
                var e = _reactDom2.default.findDOMNode(_this.itemRefs[index]);
                if (e) {
                    // MSIE sometimes manages to report non-integer element heights for elements of an integer height...
                    // Non-integer element sizes are allowed in getBoundingClientRect, one notable example of them
                    // are collapsed table borders. But we still ignore less than 1/100 of a pixel difference.
                    return Math.round(e.getBoundingClientRect().height * 100) / 100;
                }
            }
            return 0;
        }, _this.onScroll = function () {
            _this.driver();
            if (_this.props.onScroll) {
                _this.props.onScroll(_this.viewport);
            }
        }, _this.componentDidUpdate = function () {
            var changed = _this.driver();
            if (!changed && _this.state.scrollTimes > 0 && _this.props.totalItems > 0 && _this.viewport && _this.viewport.offsetParent) {
                // FIXME: It would be better to find a way to put this logic back into virtual-scroll-driver
                var pos = _this.state.scrollTo;
                if (pos > _this.state.scrollHeightInItems) {
                    pos = _this.state.scrollHeightInItems;
                }
                if (_this.state.targetHeight) {
                    _this.viewport.scrollTop = Math.round((_this.state.targetHeight - _this.state.viewportHeight) * pos / _this.state.scrollHeightInItems);
                    _this.setState({ scrollTimes: _this.state.scrollTimes - 1 });
                } else {
                    var el = _reactDom2.default.findDOMNode(_this.itemRefs[Math.floor(pos)]);
                    if (el) {
                        _this.viewport.scrollTop = el.offsetTop - (_this.props.headerHeight || 0) + el.offsetHeight * (pos - Math.floor(pos));
                    }
                    _this.setState({ scrollTimes: 0 });
                }
            }
        }, _this.scrollToItem = function (pos) {
            // Scroll position must be recalculated twice, because first render
            // may change the average row height. In fact, it must be repeated
            // until average row height stops changing, but twice is usually sufficient
            _this.setState({ scrollTo: pos, scrollTimes: 2 });
        }, _this.getItemScrollPos = function () {
            if (_this.state.targetHeight) {
                // Virtual scroll is active
                var pos = _this.viewport.scrollTop / (_this.state.targetHeight - _this.state.viewportHeight);
                return pos * _this.state.scrollHeightInItems;
            } else {
                // Virtual scroll is inactive
                var avgr = _this.viewport.scrollHeight / _this.state.totalItems;
                return _this.viewport.scrollTop / avgr;
            }
        }, _this.driver = function () {
            if (!_this.viewport || !_this.viewport.offsetParent) {
                // Fool tolerance - do nothing if we are hidden
                return false;
            }
            var newState = (0, _dynamicVirtualScroll.virtualScrollDriver)({
                totalItems: _this.props.totalItems,
                minRowHeight: _this.props.minRowHeight,
                viewportHeight: _this.props.viewportHeight || _this.viewport.clientHeight - (_this.props.headerHeight || 0),
                scrollTop: _this.viewport.scrollTop
            }, _this.state, _this.getRenderedItemHeight);
            if (newState.viewportHeight || _this.state.viewportHeight) {
                return _this.setStateIfDiffers(newState);
            }
            return false;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(VirtualScrollList, [{
        key: 'makeRef',
        value: function makeRef(i) {
            var _this2 = this;

            this.setItemRef[i] = function (e) {
                // If the new row instance is mounted before unmouting the old one,
                // we get called 2 times in wrong order: first with the new instance,
                // then with null telling us that the old one is unmounted.
                // We track reference count to workaround it.
                _this2.itemRefCount[i] = (_this2.itemRefCount[i] || 0) + (e ? 1 : -1);
                if (e || !_this2.itemRefCount[i]) {
                    _this2.itemRefs[i] = e;
                }
            };
        }
    }, {
        key: 'renderItems',
        value: function renderItems(start, count, is_end) {
            var r = [];
            for (var i = 0; i < count; i++) {
                var item = this.props.renderItem(i + start);
                if (item) {
                    if (!this.setItemRef[i + start]) {
                        this.makeRef(i + start);
                    }
                    r.push(_react2.default.createElement(item.type, _extends({}, item.props, { key: i + start, ref: this.setItemRef[i + start] })));
                }
            }
            return r;
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.state.totalItems && this.props.totalItems != this.state.totalItems && this.state.scrollTimes <= 0 && this.viewport && this.viewport.offsetParent) {
                // Automatically preserve scroll position when item count changes...
                // But only when the list is on-screen! We'll end up with an infinite update loop if it's off-screen.
                this.state.scrollTo = this.getItemScrollPos();
                this.state.scrollTimes = 2;
            }
            var props = _extends({}, this.props);
            for (var k in VirtualScrollList.propTypes) {
                delete props[k];
            }
            return _react2.default.createElement(
                'div',
                _extends({}, props, {
                    className: this.props.className,
                    style: _extends({
                        position: 'relative'
                    }, this.props.style || {}, {
                        overflowAnchor: 'none'
                    }),
                    ref: this.setViewport,
                    onScroll: this.onScroll }),
                this.props.header,
                this.state.targetHeight > 0 ? _react2.default.createElement('div', { key: 'target', style: { position: 'absolute', top: 0, left: '-5px', width: '1px', height: this.state.targetHeight + 'px' } }) : null,
                this.state.topPlaceholderHeight ? _react2.default.createElement('div', { style: { height: this.state.topPlaceholderHeight + 'px' }, key: 'top' }) : null,
                this.renderItems(this.state.firstMiddleItem, this.state.middleItemCount),
                this.state.middlePlaceholderHeight ? _react2.default.createElement('div', { style: { height: this.state.middlePlaceholderHeight + 'px' }, key: 'mid' }) : null,
                this.renderItems(this.props.totalItems - this.state.lastItemCount, this.state.lastItemCount, true)
            );
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.driver();
        }
    }, {
        key: 'setStateIfDiffers',
        value: function setStateIfDiffers(state, cb) {
            for (var k in state) {
                if (this.state[k] != state[k]) {
                    this.setState(state, cb);
                    return true;
                }
            }
            return false;
        }
    }]);

    return VirtualScrollList;
}(_react2.default.Component);

VirtualScrollList.propTypes = {
    className: _propTypes2.default.string,
    style: _propTypes2.default.object,
    totalItems: _propTypes2.default.number.isRequired,
    minRowHeight: _propTypes2.default.number.isRequired,
    viewportHeight: _propTypes2.default.number,
    header: _propTypes2.default.any,
    headerHeight: _propTypes2.default.number,
    renderItem: _propTypes2.default.func.isRequired
};

