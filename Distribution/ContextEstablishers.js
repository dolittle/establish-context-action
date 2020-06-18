"use strict";
// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextEstablishers = void 0;
/**
 * Represents an implementation of {IContextEstablishers}.
 *
 * @export
 * @class ContextEstablishers
 * @implements {IContextEstablishers}
 */
class ContextEstablishers {
    constructor(...establishers) {
        this._establishers = establishers;
    }
    establishFrom(context) {
        var _a;
        const establisher = this.getEstablisherFor(context);
        return (_a = establisher === null || establisher === void 0 ? void 0 : establisher.establish(context)) !== null && _a !== void 0 ? _a : Promise.resolve(undefined);
    }
    getEstablisherFor(context) {
        let establisher = undefined;
        for (const _establisher of this._establishers) {
            if (_establisher.canEstablishFrom(context)) {
                if (establisher !== undefined) {
                    throw new Error(`There are multiple context establishers that can establish from context ${context}`);
                }
                establisher = _establisher;
            }
        }
        return establisher;
    }
}
exports.ContextEstablishers = ContextEstablishers;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNvdXJjZS9Db250ZXh0RXN0YWJsaXNoZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwrQ0FBK0M7QUFDL0MscUdBQXFHOzs7QUFPckc7Ozs7OztHQU1HO0FBQ0gsTUFBYSxtQkFBbUI7SUFHNUIsWUFBWSxHQUFHLFlBQW9DO1FBQy9DLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO0lBQ3RDLENBQUM7SUFFRCxhQUFhLENBQUMsT0FBZ0I7O1FBQzFCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwRCxhQUFPLFdBQVcsYUFBWCxXQUFXLHVCQUFYLFdBQVcsQ0FBRSxTQUFTLENBQUMsT0FBTyxvQ0FBSyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFTyxpQkFBaUIsQ0FBQyxPQUFnQjtRQUN0QyxJQUFJLFdBQVcsR0FBcUMsU0FBUyxDQUFDO1FBQzlELEtBQUssTUFBTSxZQUFZLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUMzQyxJQUFJLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDeEMsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFO29CQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLDJFQUEyRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO2lCQUN6RztnQkFDRCxXQUFXLEdBQUcsWUFBWSxDQUFDO2FBQzlCO1NBQ0o7UUFDRCxPQUFPLFdBQVcsQ0FBQztJQUN2QixDQUFDO0NBQ0o7QUF4QkQsa0RBd0JDIiwiZmlsZSI6IkNvbnRleHRFc3RhYmxpc2hlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIERvbGl0dGxlLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLiBTZWUgTElDRU5TRSBmaWxlIGluIHRoZSBwcm9qZWN0IHJvb3QgZm9yIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbi5cblxuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gJ0BhY3Rpb25zL2dpdGh1Yi9saWIvY29udGV4dCc7XG5pbXBvcnQgeyBCdWlsZENvbnRleHQgfSBmcm9tICcuL0J1aWxkQ29udGV4dCc7XG5pbXBvcnQgeyBJQ29udGV4dEVzdGFibGlzaGVycyB9IGZyb20gJy4vSUNvbnRleHRFc3RhYmxpc2hlcnMnO1xuaW1wb3J0IHsgSUNhbkVzdGFibGlzaENvbnRleHQgfSBmcm9tICcuL0lDYW5Fc3RhYmxpc2hDb250ZXh0JztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGFuIGltcGxlbWVudGF0aW9uIG9mIHtJQ29udGV4dEVzdGFibGlzaGVyc30uXG4gKlxuICogQGV4cG9ydFxuICogQGNsYXNzIENvbnRleHRFc3RhYmxpc2hlcnNcbiAqIEBpbXBsZW1lbnRzIHtJQ29udGV4dEVzdGFibGlzaGVyc31cbiAqL1xuZXhwb3J0IGNsYXNzIENvbnRleHRFc3RhYmxpc2hlcnMgaW1wbGVtZW50cyBJQ29udGV4dEVzdGFibGlzaGVycyB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBfZXN0YWJsaXNoZXJzOiBJQ2FuRXN0YWJsaXNoQ29udGV4dFtdO1xuXG4gICAgY29uc3RydWN0b3IoLi4uZXN0YWJsaXNoZXJzOiBJQ2FuRXN0YWJsaXNoQ29udGV4dFtdKSB7XG4gICAgICAgIHRoaXMuX2VzdGFibGlzaGVycyA9IGVzdGFibGlzaGVycztcbiAgICB9XG5cbiAgICBlc3RhYmxpc2hGcm9tKGNvbnRleHQ6IENvbnRleHQpOiBQcm9taXNlPEJ1aWxkQ29udGV4dD4gfMKgUHJvbWlzZTx1bmRlZmluZWQ+IHtcbiAgICAgICAgY29uc3QgZXN0YWJsaXNoZXIgPSB0aGlzLmdldEVzdGFibGlzaGVyRm9yKGNvbnRleHQpO1xuICAgICAgICByZXR1cm4gZXN0YWJsaXNoZXI/LmVzdGFibGlzaChjb250ZXh0KSA/PyBQcm9taXNlLnJlc29sdmUodW5kZWZpbmVkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEVzdGFibGlzaGVyRm9yKGNvbnRleHQ6IENvbnRleHQpOiBJQ2FuRXN0YWJsaXNoQ29udGV4dCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGxldCBlc3RhYmxpc2hlcjogSUNhbkVzdGFibGlzaENvbnRleHQgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGZvciAoY29uc3QgX2VzdGFibGlzaGVyIG9mIHRoaXMuX2VzdGFibGlzaGVycykge1xuICAgICAgICAgICAgaWYgKF9lc3RhYmxpc2hlci5jYW5Fc3RhYmxpc2hGcm9tKGNvbnRleHQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVzdGFibGlzaGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGVyZSBhcmUgbXVsdGlwbGUgY29udGV4dCBlc3RhYmxpc2hlcnMgdGhhdCBjYW4gZXN0YWJsaXNoIGZyb20gY29udGV4dCAke2NvbnRleHR9YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVzdGFibGlzaGVyID0gX2VzdGFibGlzaGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlc3RhYmxpc2hlcjtcbiAgICB9XG59XG4iXX0=
