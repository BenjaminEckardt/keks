import * as React from 'react';
import update from 'immutability-helper';
import './cockpit.scss';
import {
    applyOverrideToMatchingCookiesAndSave,
    CookieTransformationModel,
    getHijacks,
    readCookieTransformationModels
} from '../cookies';

interface CookieTransformationView extends CookieTransformationModel {
    isActive?: boolean;
}

interface State {
    cookieTransformations: Array<CookieTransformationView>
}

export default class Cockpit extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);

        this.state = {
            cookieTransformations: [],
        };

        this.checkActivityState = this.checkActivityState.bind(this);
    }

    componentDidMount() {
        readCookieTransformationModels().then((cookieTransformations) => {
            if (cookieTransformations.length) {
                this.setState({cookieTransformations});
            }
        }).then(this.checkActivityState);
    }

    render() {
        return (
            <div className="cockpit-container">
                {this.state.cookieTransformations.map((model, index) => (
                    <div className="cockpit-entry" key={index}>
                        <span className="cockpit-entry-label">{model.name}</span>
                        <button
                            className={model.isActive ? 'active' : ''}
                            onClick={this.hijackCookies.bind(this, index)}
                        >Hijack
                        </button>
                    </div>
                ))}
                <button className="configuration-link" onClick={this.goToConfiguration}>Edit Configuration</button>
            </div>
        )
    }

    private hijackCookies(index: number) {
        const cookieTransformationModel = this.state.cookieTransformations[index];
        return applyOverrideToMatchingCookiesAndSave(cookieTransformationModel).then(() => {
            this.checkActivityState();
        });
    }

    private checkActivityState() {
        getHijacks().then((hijackResults) => {
            hijackResults.forEach((hijackResult) => {
                this.setState((prevState) => {
                    const index = prevState.cookieTransformations.findIndex((model) => model.name === hijackResult.model.name);
                    return update(prevState, {cookieTransformations: {[index]: {isActive: {$set: hijackResult.isHijacked}}}});
                });
            });
            return hijackResults;
        });
    }

    private goToConfiguration() {
        const configurationUrl = chrome.extension.getURL('configuration.html');
        chrome.tabs.create({url: configurationUrl});
    }
}