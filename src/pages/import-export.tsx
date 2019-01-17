import * as React from 'react';

interface Props {
    content: string;
    onApply: (content: string) => void;
    onCancel: () => void;
}

interface State {
    content: string;
}

class ImportExport extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            content: this.props.content
        };

        this.applyImport = this.applyImport.bind(this);
        this.updateContent = this.updateContent.bind(this);
    }

    public render() {
        return (
            <div className="import-export">
                <textarea
                    rows={30}
                    cols={80}
                    onChange={this.updateContent}
                    value={this.state.content}
                />
                <div className="import-export-actions">
                    <button onClick={this.props.onCancel}>Cancel</button>
                    <button onClick={this.applyImport}>Apply</button>
                </div>
            </div>
        );
    }

    private updateContent(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({content: event.target.value});
    }

    private applyImport() {
        this.props.onApply(this.state.content);
    }
}

export {ImportExport};