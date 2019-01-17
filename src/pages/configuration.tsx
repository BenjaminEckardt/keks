import * as React from 'react';
import update from 'immutability-helper';
import './configuration.scss';

import {
    applyOverrideToMatchingCookies,
    applyOverrideToMatchingCookiesAndSave, Cookie,
    CookieTransformationModel,
    Filter,
    findAllMatching as findAllCookiesMatching,
    Override,
    readCookieTransformationModels,
    saveCookieTransformationModels, SaveCookie,
} from '../cookies';

import {CookieFilter} from './cookie-filter';
import {CookieOverride} from './cookie-override';
import {Column, Table} from './Table';
import {Field} from './field';
import {ImportExport} from './import-export';

interface CookieTransformationView extends CookieTransformationModel {
    showMatches?: boolean;
    previews?: Array<SaveCookie>;
    matchingCookies?: Array<Cookie>;
}

const matchingColumns: Array<Column> = [
    {key: 'url', header: 'URL'},
    {key: 'domain', header: 'Domain'},
    {key: 'name', header: 'Name'},
    {key: 'value', header: 'Value'},
    {key: 'session', header: 'Session'},
    {key: 'hostOnly', header: 'Host Only'},
    {key: 'expirationDate', header: 'Expiration Date'},
    {key: 'path', header: 'Path'},
    {key: 'httpOnly', header: 'Http Only'},
    {key: 'secure', header: 'Secure'},
];

const previewColumns: Array<Column> = [
    {key: 'url', header: 'URL'},
    {key: 'domain', header: 'Domain'},
    {key: 'name', header: 'Name'},
    {key: 'value', header: 'Value'},
    {key: 'expirationDate', header: 'Expiration Date'},
    {key: 'path', header: 'Path'},
    {key: 'httpOnly', header: 'Http Only'},
];

interface ImportExportModel {
    meta: { version: string };
    cookieTransformations: Array<CookieTransformationModel>
}

interface State {
    importExportContent?: string;
    cookieTransformations: Array<CookieTransformationView>
}

export default class Configuration extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);

        this.state = {
            cookieTransformations: [],
        };

        this.new = this.new.bind(this);
        this.applyImport = this.applyImport.bind(this);
        this.cancelImport = this.cancelImport.bind(this);
        this.setAllMatches = this.setAllMatches.bind(this);
        this.showImportExport = this.showImportExport.bind(this);
        this.onImportExportContentChange = this.onImportExportContentChange.bind(this);
        this.saveCookieTransformationModel = this.saveCookieTransformationModel.bind(this);
    }

    componentDidMount() {
        readCookieTransformationModels().then((cookieTransformations) => {
            if (cookieTransformations.length) {
                return this.setStateAsync({cookieTransformations})
            }
        }).then(this.setAllMatches);
    }

    render() {
        return (
            <div className="configuration-container">
                <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 650 650" aria-labelledby="title">
                    <path
                        d="M351.68 164.34L506.26 164.34L319.28 341.87L618.98 623.36L462.38 623.36L240.31 413.42L205.88 447.85L205.88 623.36L51.98 623.36L51.98 132.15L52.55 132.04L53.78 131.74L54.99 131.38L56.17 130.96L57.27 130.51L57.32 130.7L57.74 131.88L58.22 133.04L58.75 134.17L59.34 135.28L59.98 136.35L60.67 137.39L61.41 138.4L62.2 139.36L63.04 140.29L63.93 141.18L64.86 142.02L65.83 142.82L66.85 143.57L67.91 144.27L69.01 144.92L70.14 145.52L71.31 146.06L72.52 146.55L73.76 146.97L75.04 147.33L76.34 147.63L77.66 147.86L78.97 148.02L80.28 148.1L81.58 148.12L82.87 148.08L84.15 147.97L85.41 147.79L86.66 147.55L87.89 147.25L89.1 146.89L90.28 146.47L91.44 145.99L92.57 145.46L93.68 144.87L94.75 144.23L95.79 143.54L96.79 142.8L97.76 142.01L98.69 141.17L99.58 140.28L100.42 139.35L101.22 138.38L101.97 137.36L102.67 136.3L103.12 135.55L103.63 136.1L104.51 136.99L105.44 137.83L106.42 138.63L107.43 139.38L108.49 140.08L109.59 140.73L110.72 141.33L111.9 141.87L113.1 142.35L114.34 142.78L115.62 143.14L116.92 143.44L118.24 143.67L119.56 143.83L120.87 143.91L122.17 143.93L123.46 143.89L124.73 143.78L126 143.6L127.24 143.36L128.47 143.06L129.68 142.7L130.86 142.28L132.02 141.8L133.16 141.27L134.26 140.68L135.33 140.04L136.37 139.35L137.38 138.61L138.35 137.82L139.27 136.98L140.16 136.09L141.01 135.16L141.8 134.19L142.55 133.17L143.26 132.11L143.91 131.02L144.5 129.88L145.04 128.71L145.53 127.5L145.95 126.26L146.31 124.99L146.61 123.68L146.84 122.36L147 121.05L147.09 119.74L147.11 118.44L147.06 117.15L146.97 116.14L147.69 116.19L148.99 116.21L150.28 116.16L151.56 116.05L152.82 115.88L154.07 115.64L155.3 115.34L156.51 114.98L157.69 114.56L158.85 114.08L159.98 113.55L161.09 112.96L162.16 112.32L163.2 111.63L164.2 110.89L165.17 110.09L166.1 109.25L166.99 108.37L167.83 107.44L168.63 106.46L169.38 105.45L170.08 104.39L170.73 103.29L171.33 102.16L171.87 100.99L172.35 99.78L172.78 98.54L173.14 97.26L173.44 95.96L173.67 94.64L173.83 93.32L173.91 92.02L173.93 90.72L173.89 89.43L173.77 88.15L173.6 86.89L173.36 85.64L173.06 84.41L172.7 83.2L172.28 82.02L171.8 80.86L171.27 79.73L170.68 78.62L170.04 77.55L169.35 76.51L168.61 75.51L167.82 74.54L166.98 73.61L166.09 72.72L165.16 71.88L164.88 71.65L165.41 71.33L166.45 70.63L167.46 69.89L168.43 69.1L169.35 68.26L170.24 67.37L171.09 66.44L171.88 65.47L172.64 64.45L173.34 63.39L173.99 62.3L174.58 61.16L175.12 59.99L175.61 58.78L176.03 57.54L176.39 56.27L176.69 54.96L176.92 53.64L177.08 52.33L177.17 51.02L177.19 49.72L177.14 48.43L177.03 47.15L176.85 45.89L176.61 44.64L176.31 43.42L175.95 42.21L175.53 41.02L175.06 39.86L174.52 38.73L173.94 37.63L173.3 36.56L172.6 35.52L171.86 34.51L171.07 33.54L170.23 32.61L169.34 31.73L168.41 30.88L167.44 30.08L166.42 29.33L165.36 28.63L164.27 27.98L163.13 27.38L161.96 26.84L160.75 26.36L159.51 25.94L158.24 25.57L156.93 25.28L155.61 25.05L154.3 24.89L152.99 24.8L152.04 24.79L152.22 24.34L152.64 23.1L153.01 21.82L153.3 20.52L153.53 19.2L153.69 17.88L153.78 16.57L153.8 15.27L153.75 13.98L153.64 12.71L153.46 11.44L153.23 10.2L152.93 8.97L152.56 7.76L152.15 6.58L152.06 6.38L205.88 6.38L205.88 300.69L351.68 164.34Z"
                        id="k-icon" />
                </svg>
                <h1 className="headline">keks</h1>
                {this.state.importExportContent ? (
                    <ImportExport
                        content={this.state.importExportContent}
                        onApply={this.applyImport}
                        onCancel={this.cancelImport}
                    />
                ) : (
                    <>
                        <div className="main-actions">
                            <button onClick={this.showImportExport}>Import/Export</button>
                            <button onClick={this.new}>Create new</button>
                            <button onClick={this.saveCookieTransformationModel}>Save</button>
                        </div>
                        {this.state.cookieTransformations.map((model, index) => (
                            <div className="transformation-with-tables" key={index}>
                                <div className="transformation-container">
                                    <div className="transformation-column">
                                        <h2>Filter</h2>
                                        <CookieFilter
                                            id={index}
                                            filter={model.filter}
                                            onChange={this.updateFilter.bind(this, index)}
                                        />
                                        <button onClick={this.toggleShowMatches.bind(this, index)}>Matching
                                            cookies: {(model.matchingCookies || []).length}</button>
                                    </div>

                                    <div className="transformation-column">
                                        <h2>New Values</h2>
                                        <CookieOverride
                                            id={index}
                                            override={model.override}
                                            onChange={this.updateOverride.bind(this, index)}
                                        />
                                        <button onClick={this.toggleShowPreview.bind(this, index)}>Preview</button>
                                    </div>

                                    <div className="transformation-column">
                                        <h2>General</h2>
                                        <div className="shorthand">
                                            <Field
                                                id={`name-${index}`}
                                                type="text"
                                                value={model.name}
                                                label="Shorthand"
                                                prefix="transformation"
                                                onChange={(value) => this.updateName(index, value)}
                                            />
                                        </div>
                                        <div className="detail-actions">
                                            <button onClick={this.deleteModel.bind(this, index)}>Delete</button>
                                            <button onClick={this.hijackCookies.bind(this, index)}>Hijack</button>
                                        </div>
                                    </div>
                                </div>
                                {model.showMatches && (
                                    <>
                                        <hr className="separator"/>
                                        <h2>Matching Cookies</h2>
                                        <Table columns={matchingColumns} rows={model.matchingCookies || []}/>
                                    </>
                                )}
                                {model.previews && (
                                    <>
                                        <hr className="separator"/>
                                        <h2>Preview Result</h2>
                                        <Table columns={previewColumns} rows={model.previews}/>
                                    </>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </div>
        );
    }

    private onImportExportContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({importExportContent: event.target.value});
    }

    private new() {
        this.setState((prevState) => update(prevState, {cookieTransformations: {$unshift: [this.getTransformationViewTemplate()]}}));
    }trimmedFilter

    private getTransformationViewTemplate() {
        return {
            filter: {},
            override: {
                url: '',
            }
        };
    }

    private toggleShowMatches(index: number) {
        this.setState((prevState) => update(prevState, {cookieTransformations: {[index]: {showMatches: {$set: !prevState.cookieTransformations[index].showMatches}}}}));
    }

    private toggleShowPreview(index: number) {
        const cookieTransformationView = this.state.cookieTransformations[index];
        if (cookieTransformationView.previews) {
            this.setState((prevState) => update(prevState, {cookieTransformations: {[index]: {previews: {$set: undefined}}}}))
        } else {
            applyOverrideToMatchingCookies(cookieTransformationView).then((transformedCookies) => {
                this.setState((prevState) => update(prevState, {cookieTransformations: {[index]: {previews: {$set: transformedCookies}}}}))
            });
        }
    }

    private updateName(index: number, name: string) {
        this.setState((prevState) => update(prevState, {cookieTransformations: {[index]: {name: {$set: name}}}}));
    }

    private updateOverride(index: number, override: Override) {
        this.setState((prevState) => update(prevState, {cookieTransformations: {[index]: {override: {$set: override}}}}));
    }

    private updateFilter(index: number, filter: Filter) {
        this.setStateAsync((prevState) => update(prevState, {cookieTransformations: {[index]: {filter: {$set: filter}}}}))
            .then(this.setMatches.bind(this, index));
    }

    private setMatches(index: number) {
        const {filter} = this.state.cookieTransformations[index];
        return findAllCookiesMatching(filter).then((matchingCookies) => {
            this.setStateAsync((prevState) => update(prevState, {cookieTransformations: {[index]: {matchingCookies: {$set: matchingCookies}}}}));
        });
    }

    private saveCookieTransformationModel() {
        saveCookieTransformationModels(this.state.cookieTransformations.map(this.cleanModel));
    }

    private deleteModel(index: number) {
        this.setState((prevState) => {
            const cookieTransformations = prevState.cookieTransformations.filter((m, i) => i !== index);
            return {cookieTransformations};
        });
    }

    private hijackCookies(index: number) {
        const cookieTransformationModel = this.state.cookieTransformations[index];
        return applyOverrideToMatchingCookiesAndSave(cookieTransformationModel);
    }

    private setStateAsync<K extends keyof State>(state: ((prevState: Readonly<State>, props: Readonly<{}>) => (Pick<State, K> | State | null)) | (Pick<State, K> | State | null)) {
        return new Promise(resolve => {
            this.setState(state, resolve);
        });
    }

    private setAllMatches() {
        this.state.cookieTransformations.forEach((model, index) => this.setMatches(index));
    }

    private cleanModel(model) {
        return {
            name: model.name,
            filter: model.filter,
            override: model.override
        };
    }

    private showImportExport() {
        const manifest = chrome.runtime.getManifest();
        this.setState((prevState) => {
            const exportContent: ImportExportModel = {
                meta: {version: manifest.version},
                cookieTransformations: prevState.cookieTransformations.map(this.cleanModel)
            };

            return {
                importExportContent: JSON.stringify(exportContent, null, 2)
            };
        });
    }

    private applyImport(importExportContent: string) {
        const importModel: ImportExportModel = JSON.parse(importExportContent);
        const cookieTransformations = importModel.cookieTransformations;
        this.setStateAsync({cookieTransformations, importExportContent: undefined}).then(this.setAllMatches);
    }

    private cancelImport() {
        this.setState({importExportContent: undefined});
    }
}
