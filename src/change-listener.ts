import {getHijacks} from './cookies';
import * as _ from 'lodash';

const setBadgeText = (hijackMatches) => {
    if (!hijackMatches.length) {
        chrome.browserAction.setBadgeText({text: ''});
    } else if (hijackMatches.length === 1) {
        chrome.browserAction.setBadgeText({text: hijackMatches[0].model.name});
    } else {
        chrome.browserAction.setBadgeText({text: `${hijackMatches.length}`})
    }
};


const updateBadge = () => {
    getHijacks()
        .then((hijackedResults) => hijackedResults.filter((match) => match.isHijacked))
        .then(setBadgeText);
};
const debouncedUpdate = _.debounce(updateBadge, 500);

chrome.runtime.onMessage.addListener((request) => {
    if (request.cookieTransformationModelChanged) {
        debouncedUpdate();
    }
    return false;
});

chrome.cookies.onChanged.addListener(debouncedUpdate);
