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
exports.ReportIssueAnalysisComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const ReportIssueAnaliseDTO_1 = require("app/shared/interfaces/ReportIssueAnaliseDTO");
let ReportIssueAnalysisComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({
            selector: 'app-report-issue-analysis-popup',
            templateUrl: './report-issue-analysis.component.html',
            styleUrls: ['./report-issue-analysis.component.scss'],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ReportIssueAnalysisComponent = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ReportIssueAnalysisComponent = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        dialogRef;
        toastrService;
        translateService;
        issueService;
        data;
        reportIssueAnalysisForm;
        isSubmitted = false;
        issueId;
        get reasonControl() {
            return this.reportIssueAnalysisForm.get('reason');
        }
        constructor(dialogRef, toastrService, translateService, issueService, data) {
            this.dialogRef = dialogRef;
            this.toastrService = toastrService;
            this.translateService = translateService;
            this.issueService = issueService;
            this.data = data;
        }
        ngOnInit() {
            this.initForm();
            this.issueId = this.data.issueId;
        }
        submitContact() {
            this.isSubmitted = true;
            this.reportIssueAnalysisForm.markAsDirty();
            this.reportIssueAnalysisForm.markAllAsTouched();
            if (this.reportIssueAnalysisForm.valid) {
                this.toastrService.success(this.translateService.instant('FEATURES.ISSUES.REPORT_REASON_SUCCESSFULLY_SEND'));
                this.issueService
                    .reportIssueAnalise(this.issueId, new ReportIssueAnaliseDTO_1.ReportIssueAnaliseDTO(this.reportIssueAnalysisForm.value.reason, this.reportIssueAnalysisForm.value.shouldDelete))
                    .subscribe((res) => {
                    this.toastrService.success(this.translateService.instant('FEATURES.ISSUES.REPORT_REASON_SUCCESSFULLY_SEND'));
                    this.close();
                });
            }
        }
        close() {
            this.dialogRef.close();
        }
        initForm() {
            this.reportIssueAnalysisForm = new forms_1.FormGroup({
                reason: new forms_1.FormControl(null, [forms_1.Validators.required]),
                shouldDelete: new forms_1.FormControl(null)
            });
        }
    };
    return ReportIssueAnalysisComponent = _classThis;
})();
exports.ReportIssueAnalysisComponent = ReportIssueAnalysisComponent;
//# sourceMappingURL=report-issue-analysis.component.js.map