type SaveCookie = chrome.cookies.SetDetails;
type Cookie = chrome.cookies.Cookie;

interface CookieTransformationModel {
    name?: string;
    filter: Filter;
    override: Override;
}

interface Override {
    url: string;
    domain?: string;
    name?: string;
    value?: string;
    expirationDate?: number;
    path?: string;
    httpOnly?: boolean;
    secure?: boolean;
}

interface Filter {
    url?: string;
    domain?: string;
    name?: string;
    path?: string;
    session?: boolean;
    secure?: boolean;
}

const trimToNull = (input: string) => {
    return String(input).trim() === '' ? null : input;
};

const trimPropertiesToNull = <T extends object> (object: T): T => {
    const copy = Object.assign({}, object);
    Object.keys(copy).forEach((k) => (copy[k] = trimToNull(copy[k])));
    return copy;
};

const isValidUrlScheme = (url: string) => {
    return url && url.match(/^http[s]?:\/\/.+/);
};

const findAllMatching = (filter: Filter): Promise<Array<Cookie>> => {
    const trimmedFilter = trimPropertiesToNull(filter);
    return new Promise((resolve) => {
        if (!trimmedFilter.url || isValidUrlScheme(trimmedFilter.url)) {
            chrome.cookies.getAll(trimmedFilter, resolve);
        } else {
            resolve([]);
        }
    });
};

const newPromiseWithChromeErrorHandling = (toBeCalled: (cb: (result: any) => void) => void) => {
    return new Promise((resolve, reject) => {
        const cb = (result) => {
            if (result === null) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result);
            }
        };
        toBeCalled(cb);
    });
};

const saveCookie = (cookie: SaveCookie) => {
    return newPromiseWithChromeErrorHandling((cb) => {
        chrome.cookies.set(cookie, cb);
    });
};

const applyOverrideToMatchingCookies = (model: CookieTransformationModel) => {
    const {filter, override} = model;
    return findAllMatching(filter).then((cookies) => {
        return (cookies || []).map((cookie) => {
            const domain = override.domain || cookie.domain;
            const details = {
                url: override.url,
                domain: override.url.includes(domain) ? domain : undefined,
                name: override.name || cookie.name,
                value: override.value || cookie.value,
                expirationDate: override.expirationDate || cookie.expirationDate,
                path: override.path || cookie.path,
                httpOnly: override.httpOnly || cookie.httpOnly,
                secure: override.url.startsWith('https') && override.secure,
            };
            return details;
        });
    });
};

const applyOverrideToMatchingCookiesAndSave = (model: CookieTransformationModel) => {
    return applyOverrideToMatchingCookies(model).then((cookies) => {
        return Promise.all(cookies.map(saveCookie));
    });
};

const isCookieEqualToStore = (saveCookie: SaveCookie) => {
    const cookie = trimPropertiesToNull(saveCookie);
    const {url, name} = cookie;
    return new Promise((resolve) => {
        const isEqual = (storedCookie: Cookie) => {
            const match = storedCookie !== null
                && storedCookie.path === cookie.path
                && storedCookie.value === cookie.value
                && storedCookie.secure === cookie.secure
                && storedCookie.httpOnly === cookie.httpOnly;
            return match;
        };
        const callback = (foundCookies) => resolve(Boolean(foundCookies.find(isEqual)));
        chrome.cookies.getAll({url: url + cookie.path, name}, callback);
    });
};

const isHijacked = (model: CookieTransformationModel) => {
    return applyOverrideToMatchingCookies(model).then((cookies) => {
        return Promise.all(cookies.map(isCookieEqualToStore));
    }).then((values) => values.every(Boolean));
};

const getHijacks = () => {
    return readCookieTransformationModels()
        .then((cookieTransformations) => {
            return Promise.all(cookieTransformations.map((model) => {
                return isHijacked(model).then((result) => ({model, isHijacked: result}));
            }));
        });
};

const saveCookieTransformationModels = (cookieTransformationModels: Array<CookieTransformationModel>) => {
    const cleanedCookies = cookieTransformationModels.map((model) => {
        const copy = Object.assign({}, model);
        copy.filter = trimPropertiesToNull(copy.filter);
        copy.override = trimPropertiesToNull(copy.override);
        return copy;
    });
    return new Promise(resolve => chrome.storage.local.set({cookieTransformationModels: cleanedCookies}, resolve))
        .then(() => chrome.runtime.sendMessage({ cookieTransformationModelChanged: true }))
};

const readCookieTransformationModels = (): Promise<Array<CookieTransformationModel>> => {
    return new Promise(resolve => {
        chrome.storage.local.get((stored: { cookieTransformationModels: Array<CookieTransformationModel> }) => resolve(stored.cookieTransformationModels || []));
    });
};

export {
    applyOverrideToMatchingCookies,
    applyOverrideToMatchingCookiesAndSave,
    Cookie,
    CookieTransformationModel,
    Filter,
    findAllMatching,
    getHijacks,
    isHijacked,
    readCookieTransformationModels,
    saveCookieTransformationModels,
    SaveCookie,
    Override
};