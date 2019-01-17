import * as React from 'react';

interface Props {
    columns: Array<Column>
    rows: Array<object>
}

interface Column {
    key: string;
    header: string;
}

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
                                {cookie[column.key]}
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