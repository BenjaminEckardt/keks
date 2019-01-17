import * as React from 'react';
import {Override} from '../cookies';
import {Field, FieldDeclaration} from './field';
import update from 'immutability-helper';

interface Props {
    id: number;
    override: Override;
    onChange: (override: Override) => void;
}

const FIELDS: Array<FieldDeclaration> = [
    {key: 'url', label: 'URL (required)', type: 'text'},
    {key: 'domain', label: 'Domain', type: 'text'},
    {key: 'name', label: 'Name', type: 'text'},
    {key: 'path', label: 'Path', type: 'text'},
    {key: 'value', label: 'Value', type: 'text'},
    // {key: 'expirationDate', label: 'Expiration Date', type: 'number'},
    {key: 'httpOnly', label: 'HTTP Only', type: 'checkbox'},
    {key: 'secure', label: 'Secure', type: 'checkbox'},
];


const CookieOverride: React.StatelessComponent<Props> = (props) => (
    <div className="cookie-override">
        {FIELDS.map((field, index) => (
            <Field
                id={'' + props.id}
                key={index}
                type={field.type}
                value={props.override[field.key]}
                label={field.label}
                prefix={`override-${field.key}`}
                onChange={(newValue) => props.onChange(update(props.override, {[field.key]: {$set: newValue}}))}
            />
        ))}
    </div>
);

export {CookieOverride};