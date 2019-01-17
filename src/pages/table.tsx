import * as React from 'react';

interface Props {
    columns: Array<Column>
    rows: Array<object>
}

interface Column {
    key: string;
    header: string;
}

const toString = (value: any) => {
    return value === null || value === undefined ? '' : String(value);
};

class Table extends React.Component<Props, {}> {
    public render() {
        return (
            <table>
                <thead>
                <tr>
                    {this.props.columns.map((column) => (
                        <th key={column.key}>
                            {column.header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {this.props.rows.map((cookie, index) => (
                    <tr key={index}>
                        {this.props.columns.map((column) => (
                            <td key={column.key}>
                                {toString(cookie[column.key])}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        );
    }
}

export {Column, Table};