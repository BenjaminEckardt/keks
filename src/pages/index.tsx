import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Configuration from './configuration';

chrome.tabs.query({active: true, currentWindow: true}, () => {
    ReactDOM.render(<Configuration/>, document.getElementById('configuration'));
});
