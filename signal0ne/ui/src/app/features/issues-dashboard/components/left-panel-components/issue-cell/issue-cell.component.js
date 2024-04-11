"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueCellComponent = void 0;
const core_1 = require("@angular/core");
const IssueSeverity_1 = require("app/shared/enum/IssueSeverity");
let IssueCellComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({
            selector: 'app-issue-cell',
            templateUrl: './issue-cell.component.html',
            styleUrls: ['./issue-cell.component.scss']
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _issue_decorators;
    let _issue_initializers = [];
    let _issue_extraInitializers = [];
    let _isSelected_decorators;
    let _isSelected_initializers = [];
    let _isSelected_extraInitializers = [];
    var IssueCellComponent = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _issue_decorators = [(0, core_1.Input)()];
            _isSelected_decorators = [(0, core_1.Input)()];
            __esDecorate(null, null, _issue_decorators, { kind: "field", name: "issue", static: false, private: false, access: { has: obj => "issue" in obj, get: obj => obj.issue, set: (obj, value) => { obj.issue = value; } }, metadata: _metadata }, _issue_initializers, _issue_extraInitializers);
            __esDecorate(null, null, _isSelected_decorators, { kind: "field", name: "isSelected", static: false, private: false, access: { has: obj => "isSelected" in obj, get: obj => obj.isSelected, set: (obj, value) => { obj.isSelected = value; } }, metadata: _metadata }, _isSelected_initializers, _isSelected_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            IssueCellComponent = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        IssueSeverity = IssueSeverity_1.IssueSeverity;
        issue = __runInitializers(this, _issue_initializers, void 0);
        isSelected = (__runInitializers(this, _issue_extraInitializers), __runInitializers(this, _isSelected_initializers, void 0));
        constructor() {
            __runInitializers(this, _isSelected_extraInitializers);
        }
    };
    return IssueCellComponent = _classThis;
})();
exports.IssueCellComponent = IssueCellComponent;
//# sourceMappingURL=issue-cell.component.js.map