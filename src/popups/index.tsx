import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Cockpit from './cockpit';

chrome.tabs.query({ active: true, currentWindow: true }, () => {
    ReactDOM.render(<Cockpit />, document.getElementById('cockpit'));
});